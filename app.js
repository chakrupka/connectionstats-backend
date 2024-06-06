import express from "express";
import "express-async-errors";
import cors from "cors";
import config from "./utils/config.js";
import logger from "./utils/logger.js";
import middleware from "./utils/middleware.js";
import mongoose from "mongoose";
import gamesRouter from "./controllers/games.js";
import usersRouter from "./controllers/users.js";

const app = express();

mongoose.set("strictQuery", false);
logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI)
  .then((result) => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(express.json());
app.use(cors());
app.use(middleware.requestLogger);

app.use("/api/games", gamesRouter);
app.use("/api/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

app.get("/", (req, res) => {
  res.send("<h1>Response OK</h1>");
});

export default app;
