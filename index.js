import express, { response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import newDate from "./utils/date.js";
import dotenv from "dotenv";
import Game from "./models/game.js";
import parseGame from "./utils/parse_connections.js";
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

mongoose.set("strictQuery", false);
const mongoURL = process.env.MONGODB_URI;
mongoose
  .connect(mongoURL)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

app.get("/", (req, res) => {
  res.send("<h1>Response OK</h1>");
});

app.post("/api/game", (req, res) => {
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

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
