import { Router } from "express";
import newDate from "../functions/date.js";
import parseGame from "../functions/parse_game.js";
import Game from "../models/game.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const gamesRouter = Router();

const getToken = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
};

gamesRouter.post("/game", async (req, res) => {
  const body = req.body;

  const decodedToken = jwt.verify(getToken(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  if (!body) {
    return res.status(400).json({ error: "content missing" });
  }

  const gameInfo = parseGame(body);
  const game = new Game({
    number: parseInt(gameInfo.number),
    sequence: gameInfo.sequence,
    score: gameInfo.score ? parseInt(gameInfo.score) : null,
    order: gameInfo.order,
    tries: parseInt(gameInfo.tries),
    date: newDate(),
    user: user.id,
  });

  const savedGame = await game.save();
  user.games = user.games.concat(savedGame._id);
  await user.save();

  res.status(201).json(savedGame);
});

gamesRouter.get("/user", async (req, res) => {
  const decodedToken = jwt.verify(getToken(req), process.env.SECRET);
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token invalid" });
  }
  const user = await User.findById(decodedToken.id);

  const usersGames = await Promise.all(
    user.games.map((gameId) => Game.findById(gameId))
  );

  if (usersGames) {
    res.json(usersGames);
  } else {
    res.status(404).end();
  }
});

gamesRouter.get("/today", async (req, res) => {
  const todaysGames = await Game.find({ date: newDate() }).populate("user", {
    username: 1,
    name: 1,
  });
  if (todaysGames) {
    res.json(todaysGames);
  } else {
    res.status(404).end();
  }
});

gamesRouter.get("/", async (req, res) => {
  const allGames = await Game.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  if (allGames) {
    const gamesWithUser = allGames.filter((game) => game.user != null);
    res.json(gamesWithUser);
  } else {
    res.status(404).end();
  }
});

export default gamesRouter;
