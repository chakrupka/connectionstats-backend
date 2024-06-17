const checkValidLine = (line) => {
  if (
    line === "yyyy" ||
    line === "gggg" ||
    line === "bbbb" ||
    line === "pppp"
  ) {
    return true;
  } else {
    return false;
  }
};

const checkIfSuccess = (lines) => {
  if (
    lines.some((line) => line.localeCompare("yyyy") === 0) &&
    lines.some((line) => line.localeCompare("gggg") === 0) &&
    lines.some((line) => line.localeCompare("bbbb") === 0) &&
    lines.some((line) => line.localeCompare("pppp") === 0)
  ) {
    return true;
  } else {
    return false;
  }
};

const scoreGame = (lines) => {
  const worths = {
    y: 1,
    g: 2,
    b: 3,
    p: 4,
  };

  let score = 0;
  for (let i = 0; i < 4; i++) {
    if (checkValidLine(lines[i])) {
      score = score + (4 - i) * worths[lines[i][0]];
    }
  }

  return score;
};

const parseGame = (input) => {
  const game = input;
  const lines = game.sequence;
  game.tries = lines.length;

  if (checkIfSuccess(lines)) {
    const positions = {
      y: lines.indexOf("yyyy"),
      g: lines.indexOf("gggg"),
      b: lines.indexOf("bbbb"),
      p: lines.indexOf("pppp"),
    };

    const ordered = Object.entries(positions)
      .sort(([, a], [, b]) => a - b)
      .map(([key]) => key);

    game.order = ordered;
    game.score = scoreGame(lines);
  } else {
    game.order = null;
    game.score = null;
  }
  return game;
};

export default parseGame;
