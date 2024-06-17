import { Router } from "express";
import dateLib from "../libraries/date_lib.js";
import parseGame from "../libraries/game_lib.js";
import Game from "../models/game.js";
import verifyAndGetUser from "../utils/userauth.js";

const gamesRouter = Router();

gamesRouter.post("/game", async (req, res) => {
  const body = req.body;

  const user = await verifyAndGetUser(req, res);
  if (!user) return;

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
    date: dateLib.newDateEST(),
    user: user.id,
  });

  const savedGame = await game.save();
  user.games = user.games.concat(savedGame._id);
  await user.save();

  res.status(201).json(savedGame);
});

gamesRouter.get("/user", async (req, res) => {
  const user = await verifyAndGetUser(req, res);
  if (!user) return;

  const usersGames = await Promise.all(
    user.games.map((gameId) => Game.findById(gameId))
  );

  if (usersGames) {
    res.json(usersGames);
  } else {
    res.status(404).end();
  }
});

gamesRouter.get("/top/today", async (req, res) => {
  const todaysGames = await Game.find({
    date: dateLib.newDateEST(),
  }).populate("user", {
    username: 1,
    name: 1,
  });
  if (todaysGames) {
    todaysGames.sort((a, b) =>
      b.score - a.score === 0 ? a.tries - b.tries : b.score - a.score
    );
    todaysGames.splice(10);
    res.json(todaysGames);
  } else {
    res.status(404).end();
  }
});

gamesRouter.get("/top/all", async (req, res) => {
  const allGames = await Game.find({}).populate("user", {
    username: 1,
    name: 1,
  });
  if (allGames) {
    const gamesWithUser = allGames.filter((game) => game.user != null);
    gamesWithUser.sort((a, b) =>
      b.score - a.score === 0 ? a.tries - b.tries : b.score - a.score
    );
    gamesWithUser.splice(10);
    res.json(gamesWithUser);
  } else {
    res.status(404).end();
  }
});

export default gamesRouter;
