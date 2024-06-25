/*
 * Various functions to interpret user game data
 * Cha Krupka June 2024
 */

import dateLib from "./date_lib.js";

const sortGames = (games) => {
  return games.sort((a, b) => a.number - b.number);
};

const isAStreak = (game1, game2) => {
  if (game1.score == null || game2.score == null) return false;
  return game1.number + 1 === game2.number || game1.number - 1 === game2.number;
};

const longestStreak = (gamesArray) => {
  if (!gamesArray || gamesArray.length === 0) {
    return 0;
  }

  const games = sortGames(gamesArray);
  let longest = 0;
  let pos1 = 0;
  let pos2 = 1;

  while (pos1 < games.length) {
    let start = pos1,
      end = pos1;
    if (games[start].score == null) {
      pos1++;
      pos2++;
      continue;
    }
    while (pos2 < games.length && isAStreak(games[pos1], games[pos2])) {
      pos1++;
      end = pos2++;
    }
    longest = end - start + 1 > longest ? end - start + 1 : longest;
    pos1 = pos2++;
  }

  return longest;
};

const currentStreak = (gamesArray) => {
  if (!gamesArray || gamesArray.length < 1) {
    return 0;
  }

  const games = sortGames(gamesArray);
  if (
    games[games.length - 1].number !== dateLib.getTodayPuzzleNum() ||
    games[games.length - 1].score == null
  ) {
    return 0;
  }

  let pos1 = 1;
  let pos2 = 2;
  let start = pos1,
    end = pos1;
  while (
    pos2 <= games.length &&
    isAStreak(games[games.length - pos1], games[games.length - pos2])
  ) {
    pos1++;
    end = pos2++;
  }
  return end - start + 1;
};

const prevStreak = (gamesArray) => {
  if (!gamesArray || gamesArray.length < 1) {
    return 0;
  }

  const games = sortGames(gamesArray);
  if (
    games[games.length - 1].number !== dateLib.getTodayPuzzleNum() - 1 ||
    games[games.length - 1].score == null
  ) {
    return 0;
  }

  let pos1 = 1;
  let pos2 = 2;
  let start = pos1,
    end = pos1;
  while (
    pos2 <= games.length &&
    isAStreak(games[games.length - pos1], games[games.length - pos2])
  ) {
    pos1++;
    end = pos2++;
  }
  return end - start + 1;
};

const numSolved = (games) => {
  if (!games) return 0;
  let solved = 0;
  games.map((game) => {
    if (game.score) solved++;
  });
  return solved;
};

const highestScore = (games) => {
  if (!games) return 0;
  let highGame = games[0];
  games.map((game) => {
    if (game.score && game.score > highGame.score) highGame = game;
  });
  return highGame;
};

const solvePercent = (games) => {
  if (!games || numSolved(games) === 0) return 0;
  return ((numSolved(games) * 100) / games.length).toFixed(0);
};

/* Ideas
 * - Number of perfect games
 * - % of games in which [color] was solved first (for each color)
 */

export default {
  longestStreak,
  currentStreak,
  prevStreak,
  numSolved,
  highestScore,
  solvePercent,
};
