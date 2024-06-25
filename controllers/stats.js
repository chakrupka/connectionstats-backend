/*
 * Controller for sending stats information
 * Cha Krupka, June 2024
 */

import { Router } from "express";
import statsLib from "../libraries/stats_lib.js";
import dateLib from "../libraries/date_lib.js";
import Game from "../models/game.js";
import verifyAndGetUser from "../utils/userauth.js";

const statsRouter = Router();

statsRouter.get("/user", async (req, res) => {
  const user = await verifyAndGetUser(req, res);
  if (!user) return;

  const usersGames = await Promise.all(
    user.games.map((gameId) => Game.findById(gameId))
  );

  if (usersGames) {
    const stats = {
      currentStreak: statsLib.currentStreak(usersGames),
      longestStreak: statsLib.longestStreak(usersGames),
      solvedGames: statsLib.numSolved(usersGames),
      solvePercent: statsLib.solvePercent(usersGames),
      totalGames: usersGames.length,
    };

    console.log(statsLib.currentStreak(usersGames));
    console.log(dateLib.getTodayPuzzleNum());
    res.json(stats);
  } else {
    res.status(404).end();
  }
});

export default statsRouter;
