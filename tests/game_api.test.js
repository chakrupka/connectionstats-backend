import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Game from "../models/game.js";
import testGames from "./testnotes.js";

const api = supertest(app);

// beforeEach(async () => {
//   await Game.deleteMany({});
//   const gameObjects = testGames.map((game) => new Game(game));
//   const promiseArray = gameObjects.map((game) => game.save());
//   await Promise.all(promiseArray);
//   // alternatively
//   // for (let testGame of testGames) {
//   //   let gameObject = new Game(testGame);
//   //   await gameObject.save();
//   // }
// });

test("data is returned as json", async () => {
  await api
    .get("/api/games/all")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// test("there are four notes", async () => {
//   const response = await api.get("/api/games/all");

//   assert.strictEqual(response.body.length, 4);
// });

after(async () => {
  await mongoose.connection.close();
});
