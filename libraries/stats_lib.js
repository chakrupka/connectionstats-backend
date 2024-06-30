/*
 * Various functions to interpret user game data
 * Cha Krupka June 2024
 */

import dateLib from "./date_lib.js";

const sortGames = (games) => {
  return games.sort((a, b) => a.number - b.number);
};

const isAStreak = (game1, game2) => {
  // if (game1.score == null || game2.score == null) return false;
  return game1.number + 1 === game2.number || game1.number - 1 === game2.number;
};

const longestStreak = (gamesArray) => {
  if (!gamesArray || gamesArray.length === 0) {
    return 0;
  }
  const games = sortGames(gamesArray);
  let longest = 0,
    pos1 = 0,
    pos2 = 1;
  while (pos1 < games.length) {
    let start = pos1,
      end = pos1;
    while (pos2 < games.length && isAStreak(games[pos1], games[pos2])) {
      pos1++;
      end = pos2++;
    }
    longest = Math.max(end - start + 1, longest);
    pos1 = pos2++;
  }
  return longest;
};

const currentStreak = (gamesArray) => {
  if (!gamesArray || gamesArray.length < 1) {
    return 0;
  }
  const games = sortGames(gamesArray);
  if (games[games.length - 1].number !== dateLib.getTodayPuzzleNum()) {
    return 0;
  }
  let pos1 = 1,
    pos2 = 2,
    start = pos1,
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
  if (games[games.length - 1].number !== dateLib.getTodayPuzzleNum() - 1) {
    return 0;
  }
  let pos1 = 1,
    pos2 = 2,
    start = pos1,
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
  games.forEach((game) => {
    if (game.score) solved++;
  });
  return solved;
};

const highestScore = (games) => {
  if (!games) return 0;
  let highGame = games[0];
  games.forEach((game) => {
    if (game.score && game.score > highGame.score) highGame = game;
  });
  return highGame;
};

const solvePercent = (games) => {
  const solved = numSolved(games);
  if (solved === 0) return 0;
  return ((solved * 100) / games.length).toFixed(2);
};

const numPerfect = (games) => {
  if (!games) return 0;
  let perfect = 0;
  games.forEach((game) => {
    if (game.score === 30) perfect++;
  });
  return perfect;
};

const avgScore = (games) => {
  if (!games) return 0;
  let totalScore = 0;
  games.forEach((game) => {
    if (game.score >= 0) totalScore += game.score;
    else totalScore -= 5; // penalty for failing
  });
  return (totalScore / games.length).toFixed(2);
};

// get an object containing a single user's stats, including:
// current, previous, and longest streaks, # perfect, # solved, # submitted,
// solve rate, avg score
const getAllUserStats = (userGames) => {
  const stats = {
    currentStreak: currentStreak(userGames),
    prevStreak: prevStreak(userGames),
    longestStreak: longestStreak(userGames),
    solvedGames: numSolved(userGames),
    solvePercent: solvePercent(userGames),
    totalGames: userGames.length,
    perfectGames: numPerfect(userGames),
    avgScore: avgScore(userGames),
  };
  return stats;
};

/* For use in leaderboard */

// get list of users sorted by # games submitted (min. 1 game)
const getByNumSubmitted = (users) => {
  const usersWithNumGames = users.reduce((acc, user) => {
    const numGames = user.games.length;
    if (numGames) acc.push([user.username, numGames]);
    return acc;
  }, []);
  usersWithNumGames.sort((a, b) => b[1] - a[1]);
  return usersWithNumGames;
};

// get list of users sorted by # games solved (min. 1 game)
const getByNumSolved = (users) => {
  const usersWithNumSolved = users.reduce((acc, user) => {
    const solved = numSolved(user.games);
    if (solved) acc.push([user.username, solved]);
    return acc;
  }, []);
  usersWithNumSolved.sort((a, b) => b[1] - a[1]);
  return usersWithNumSolved;
};

// get list of users sorted by # perfect games (min. 1 game)
const getByNumPerfect = (users) => {
  const usersWithNumPerfect = users.reduce((acc, user) => {
    const perfect = numPerfect(user.games);
    if (perfect) acc.push([user.username, perfect]);
    return acc;
  }, []);
  usersWithNumPerfect.sort((a, b) => b[1] - a[1]);
  return usersWithNumPerfect;
};

// get list of users sorted by solve rate (min. 10 games)
const getBySolveRate = (users) => {
  const usersWithSolveRate = users.reduce((acc, user) => {
    if (user.games.length >= 10) {
      acc.push([user.username, solvePercent(user.games)]);
    }
    return acc;
  }, []);
  usersWithSolveRate.sort((a, b) => b[1] - a[1]);
  return usersWithSolveRate;
};

// get list of users sorted by average score (min. 10 games)
const getByAvgScore = (users) => {
  const usersWithAvergageScore = users.reduce((acc, user) => {
    if (user.games.length >= 10) {
      acc.push([user.username, avgScore(user.games)]);
    }
    return acc;
  }, []);
  usersWithAvergageScore.sort((a, b) => b[1] - a[1]);
  return usersWithAvergageScore;
};

// get list of users sorted by longest streak (min. 2 days)
const getByLongStreak = (users) => {
  const usersWithLongStreak = users.reduce((acc, user) => {
    const longStreak = longestStreak(user.games);
    if (longStreak >= 2) {
      acc.push([user.username, longStreak]);
    }
    return acc;
  }, []);
  usersWithLongStreak.sort((a, b) => b[1] - a[1]);
  return usersWithLongStreak;
};

// get an object containing all time stat caregories, including:
// # submitted, # solved, solve rate, # perfect, average score, longest streak
// each category is a list of lists, format: [[username, category score], ...]
const getAllTopStats = (users) => {
  const allStats = {};
  allStats.byNumSubmitted = getByNumSubmitted(users);
  allStats.byNumSolved = getByNumSolved(users);
  allStats.byNumPerfect = getByNumPerfect(users);
  allStats.bySolveRate = getBySolveRate(users);
  allStats.byAvgScore = getByAvgScore(users);
  allStats.byLongStreak = getByLongStreak(users);
  return allStats;
};

/* Ideas
 * - Number of perfect games
 * - % of games in which [color] was solved first (for each color)
 */

export default {
  getAllUserStats,
  getAllTopStats,
};
