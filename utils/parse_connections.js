const failInput = `Connections
Puzzle #282
🟨🟨🟨🟨
🟦🟦🟦🟦
🟪🟪🟩🟩
🟪🟩🟪🟩
🟩🟪🟪🟩
🟪🟪🟩🟩`;

const successInput = `Connections
Puzzle #282
🟨🟨🟨🟨
🟦🟦🟦🟦
🟪🟪🟩🟩
🟪🟩🟪🟩
🟩🟩🟩🟩
🟪🟪🟪🟪`;

const perfectInput = `Connections
Puzzle #282
🟪🟪🟪🟪
🟦🟦🟦🟦
🟩🟩🟩🟩
🟨🟨🟨🟨`;

const colorToChar = (input) => {
  let sequence = input.toString();
  const colorEmojis = ["🟨", "🟩", "🟦", "🟪"];
  const colorLetters = ["y", "g", "b", "p"];
  for (let i = 0; i < 4; i++) {
    sequence = sequence.replaceAll(colorEmojis[i], colorLetters[i]);
  }
  return sequence;
};

const getGameData = (input) => {
  const game = {};
  let inputLines = input.split("\n");
  game.puzzleNum = inputLines[1].slice(inputLines[1].indexOf("#") + 1);
  game.sequence = colorToChar(inputLines.slice(2));

  return game;
};

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

const scoreGame = (game) => {
  const worths = {
    y: 1,
    g: 2,
    b: 3,
    p: 4,
  };

  let score = 0;
  const lines = game.sequence.split(",");
  for (let i = 0; i < 4; i++) {
    if (checkValidLine(lines[i])) {
      score = score + (4 - i) * worths[lines[i][0]];
    }
  }

  return score;
};

const parseInput = (input) => {
  const game = getGameData(input);
  const lines = game.sequence.split(",");
  game.numberTries = lines.length;

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

    game.orderOfColors = ordered;
    game.score = scoreGame(game);
  } else {
    game.orderOfColors = [null, null, null, null];
    game.score = -1;
  }
  return game;
};

console.log(parseInput(failInput));
console.log(parseInput(successInput));
console.log(parseInput(perfectInput));

export default parseInput;
