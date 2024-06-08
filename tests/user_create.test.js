// For testing user creation
// Cha Krupka Spring 2024

import bcrypt from "bcrypt";
import User from "../models/user.js";
import { usersInDB } from "./test_helper.js";
import supertest from "supertest";
import app from "../app.js";
import mongoose from "mongoose";
import assert from "node:assert/strict";
import { test, describe, after, beforeEach } from "node:test";

const api = supertest(app);
const runAll = process.env.RUN_ALL === "true";
const runDupe = runAll ? true : process.env.RUN_DUPE === "true";
const runUsername = runAll ? true : process.env.RUN_USERNAME === "true";
const runPassword = runAll ? true : process.env.RUN_PASSWORD === "true";
const runName = runAll ? true : process.env.RUN_NAME === "true";

if (runDupe) {
  describe("with one initial user", () => {
    beforeEach(async () => {
      await User.deleteMany({});
      const passwordHash = await bcrypt.hash("password", 10);
      const user = new User({ username: "root", passwordHash });

      await user.save();
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

    after(async () => {
      await User.deleteMany({});
    });
  });
}

if (runUsername) {
  describe("validating username", () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test("valid parameters", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "goated2002",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert.strictEqual(finalUsers.length, initialUsers.length + 1);
    });

    test("no username", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("missing content"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (trailing period)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha...",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (leading period)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: ".cha",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (too short)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "ch",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (too long)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username:
          "csdajfghaslkdfhjhkaljsdgfjkahsdgfkjahdsgfkjhasdgfjkhasfgdkjah",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (empty)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("missing content"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (only a space)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: " ",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (has a space)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha cha",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (cha..Cha_)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha..Cha_",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username invalid (invalid characters)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha@",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed to meet"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("username valid (cha.Cha_)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha.Cha_",
        name: "Cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert.strictEqual(finalUsers.length, initialUsers.length + 1);
    });

    after(async () => {
      await User.deleteMany({});
    });
  });
}

if (runPassword) {
  describe("validating password", () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test("valid parameters", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "goated2002",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert.strictEqual(finalUsers.length, initialUsers.length + 1);
    });

    test("no password", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("missing content"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("password invalid (too short)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "short",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("password invalid (too long)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "thispasswodiswayyyyyyyyyyyyyyyyyyytoolong",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("password invalid (invalid characters [á])", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "pássword",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("password invalid (invalid characters [`])", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "password`",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("password invalid (space)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "password password",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("password valid? (________)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "________",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert.strictEqual(finalUsers.length, initialUsers.length + 1);
    });

    test("password valid (!*&@#*()!)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: `!*&@#*()!`,
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert.strictEqual(finalUsers.length, initialUsers.length + 1);
    });

    after(async () => {
      await User.deleteMany({});
    });
  });
}

if (runName) {
  describe("validating name", () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    test("valid parameters", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha",
        password: "goated2002",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert.strictEqual(finalUsers.length, initialUsers.length + 1);
    });

    test("no name", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("missing content"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("name invalid (too short)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "c",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("name invalid (too long)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "thispasswodiswayyyyyyyyyyyyyyyyyyytoolong",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("name invalid (invalid characters [á])", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Chá",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("name invalid (invalid characters [special])", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha!@@ADl.,/2",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("name invalid (invalid characters [number])", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha1",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("name invalid (space)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha ",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    test("name invalid (two words)", async () => {
      const initialUsers = await usersInDB();

      const newUser = {
        username: "cha",
        name: "Cha cha",
        password: "goated2002",
      };

      const result = await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const finalUsers = await usersInDB();
      assert(result.body.error.includes("failed"));
      assert.strictEqual(finalUsers.length, initialUsers.length);
    });

    after(async () => {
      await User.deleteMany({});
    });
  });
}

after(async () => {
  await mongoose.connection.close();
  console.log("FINISHED TESTS");
});
