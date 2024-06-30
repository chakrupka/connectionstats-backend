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

  usersGames.sort((a, b) => b.number - a.number);

  if (usersGames) {
    res.json(usersGames);
  } else {
    res.status(404).end();
  }
});

export default gamesRouter;
