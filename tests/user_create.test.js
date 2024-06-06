// For testing user creation
// Cha Krupka Spring 2024

import * as bcrypt from "bcrypt";
import User from "../models/user.js";
import { usersInDB } from "./test_helper.js";
import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import assert from "node:assert/strict";
import { test, describe, after, beforeEach } from "node:test";

const api = supertest(app);

describe("with one initial user", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash("password", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("creation succeeds with a fresh username", async () => {
    const initialUsers = await usersInDB();

    const newUser = {
      username: "cha",
      name: "Cha Krupka",
      password: "goated2002",
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const finalUsers = await usersInDB();
    assert.strictEqual(finalUsers.length, initialUsers.length + 1);

    const usernames = finalUsers.map((users) => users.username);
    assert(usernames.includes(newUser.username));
  });

  test("correct error if username is already taken", async () => {
    const initialUsers = await usersInDB();

    const newUser = {
      username: "root",
      name: "Admin",
      password: "password",
    };

    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const finalUsers = await usersInDB();
    assert(result.body.error.includes("expected `username` to be unique"));
    assert.strictEqual(finalUsers.length, initialUsers.length);
  });
});

after(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
});
