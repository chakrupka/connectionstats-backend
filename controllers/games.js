import { Router } from "express";
import dateLib from "../libraries/date_lib.js";
import parseGame from "../libraries/game_lib.js";
import Game from "../models/game.js";
import User from "../models/user.js";
import verifyAndGetUser, { getToken } from "../utils/userauth.js";
import { ObjectId } from "mongodb";

const gamesRouter = Router();

gamesRouter.post("/game", async (req, res) => {
  const body = req.body;

  const user = await verifyAndGetUser(req, res);
  if (!user) return;

  if (!body) {
    return res.status(400).json({ error: "content missing" });
  }

  const gameInfo = parseGame(body);
  const userId = ObjectId.createFromHexString(user.id);
  const duplicate = await Game.findOne({
    number: parseInt(gameInfo.number),
    user: userId,
  });
  if (duplicate) {
    return res.status(409).json({ error: "game already submitted" });
  }

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

gamesRouter.post("/text", async (req, res) => {
  const body = req.body;

  if (process.env.IMESSAGE_TOKEN !== getToken(req)) {
    return res.status(401).json({ error: "unauthorized" });
  }

  if (!body) {
    return res.status(400).json({ error: "content missing" });
  }

  const user = await User.findOne({ username: body.username });

  if (!user) {
    return res.status(400).json({ error: "content missing" });
  }

  const gameInfo = parseGame(body.game);
  const userId = ObjectId.createFromHexString(user.id);
  const duplicate = await Game.findOne({
    number: parseInt(gameInfo.number),
    user: userId,
  });
  if (duplicate) {
    return res.status(409).json({ error: "game already submitted" });
  }

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
  console.log("saved game");

  res.status(201).json(savedGame);
});

gamesRouter.get("/user", async (req, res) => {
  const user = await verifyAndGetUser(req, res);
  if (!user) return;

  const usersGames = await Promise.all(
    user.games.map((gameId) => Game.findById(gameId))
  );

  usersGames.sort((a, b) => b.number - a.number);

  if (usersGames) {
    res.json(usersGames);
  } else {
    res.status(404).end();
  }
});

export default gamesRouter;
