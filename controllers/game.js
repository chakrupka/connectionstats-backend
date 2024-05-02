import { Router } from "express";
import newDate from "../functions/date.js";
import parseGame from "../functions/parseGame.js";
import Game from "../models/game.js";
export const gamesRouter = Router();

gamesRouter.post("/game", (req, res) => {
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

  game.save().then((savedGame) => {
    res.json(savedGame);
  });
});

gamesRouter.get("/today", (req, res) => {
  Game.find({ date: newDate() }).then((games) => {
    res.json(games);
  });
});

export default gamesRouter;
