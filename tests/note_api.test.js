import { test, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import supertest from "supertest";
import app from "../app.js";
import Game from "../models/game.js";
import testGames from "./testnotes.js";

const api = supertest(app);

beforeEach(async () => {
  await Game.deleteMany({});
  for (let game of testGames) {
    let gameObject = new Game(game);
    await gameObject.save();
  }
});

test("data is returned as json", async () => {
  await api
    .get("/api/games/all")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("there are four notes", async () => {
  const response = await api.get("/api/games/all");

  assert.strictEqual(response.body.length, 4);
});

// Example from fullstackopen. Data syntax is wrong
// test("the first note is about HTTP methods", async () => {
//   const response = await api.get("/api/games/");

//   const contents = response.body.map((e) => e.content);
//   assert.strictEqual(contents.includes("HTML is easy"), true); // true/false
//   assert(contents.includes('HTML is easy')) // truthy or not
// });

after(async () => {
  await mongoose.connection.close();
});
