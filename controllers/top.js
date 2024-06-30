import { Router } from "express";
import dateLib from "../libraries/date_lib.js";
import Game from "../models/game.js";
import User from "../models/user.js";
import statsLib from "../libraries/stats_lib.js";

const topRouter = Router();

// get top games today (EST)
// returns list of objects, with each object containing username and game info
topRouter.get("/today", async (req, res) => {
  const todaysGames = await Game.find({
    number: dateLib.getTodayPuzzleNum(),
  }).populate("user", {
    username: 1,
  });
  if (todaysGames) {
    todaysGames.sort((a, b) =>
      b.score - a.score === 0 ? a.tries - b.tries : b.score - a.score
    );
    res.json(todaysGames);
  } else {
    res.status(404).end();
  }
});

// get top games yesterday (EST)
// returns list of objects, with each object containing username and game info
topRouter.get("/yesterday", async (req, res) => {
  const games = await Game.find({
    number: dateLib.getYesterdayPuzzleNum(),
  }).populate("user", {
    username: 1,
  });
  if (games) {
    games.sort((a, b) =>
      b.score - a.score === 0 ? a.tries - b.tries : b.score - a.score
    );
    res.json(games);
  } else {
    res.status(404).end();
  }
});

// get all time leaderboard data
topRouter.get("/all", async (req, res) => {
  const usersWithGames = await User.find({}, { username: 1 }).populate(
    "games",
    {
      number: 1,
      sequence: 1,
      score: 1,
      tries: 1,
      date: 1,
    }
  );
  if (usersWithGames) {
    const allStats = statsLib.getAllTopStats(usersWithGames);
    res.json(allStats);
  } else {
    res.status(404).end();
  }
});

export default topRouter;
