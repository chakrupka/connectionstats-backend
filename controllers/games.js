import { Router } from "express";
import newDate from "../functions/date.js";
import parseGame from "../functions/parseGame.js";
import Game from "../models/game.js";
export const gamesRouter = Router();

gamesRouter.post("/game", async (req, res) => {
  const body = req.body;
  if (body.content === undefined) {
    return res.status(400).json({ error: "content missing" });
  }

  const gameInfo = parseGame(body.content);

  const game = new Game({
    number: parseInt(gameInfo.number),
    sequence: gameInfo.sequence,
    score: gameInfo.score ? parseInt(gameInfo.score) : null,
    order: gameInfo.order,
    tries: parseInt(gameInfo.tries),
    date: newDate(),
    user: gameInfo.user ? gameInfo.user : "Anonymous",
  });

  const savedGame = await game.save();
  res.status(201).json(savedGame);
});

gamesRouter.get("/today", async (req, res) => {
  const todaysGames = await Game.find({ date: newDate() });
  if (todaysGames) {
    res.json(todaysGames);
  } else {
    res.status(404).end();
  }
});

gamesRouter.get("/all", async (req, res) => {
  const allGames = await Game.find({});
  if (allGames) {
    res.json(allGames);
  } else {
    res.status(404).end();
  }
});

export default gamesRouter;
