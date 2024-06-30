/*
 * Controller for sending stats information
 * Cha Krupka, June 2024
 */

import { Router } from "express";
import statsLib from "../libraries/stats_lib.js";
import Game from "../models/game.js";
import verifyAndGetUser from "../utils/userauth.js";

const statsRouter = Router();

statsRouter.get("/user", async (req, res) => {
  const user = await verifyAndGetUser(req, res);
  if (!user) return;

  const userGames = await Promise.all(
    user.games.map((gameId) => Game.findById(gameId))
  );

  if (userGames) {
    const userStats = statsLib.getAllUserStats(userGames);
    res.json(userStats);
  } else {
    res.status(404).end();
  }
});

export default statsRouter;
