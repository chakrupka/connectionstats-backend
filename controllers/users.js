// Router for handling user creation and verification
// Cha Krupka Spring 2024

import { Router } from "express";
import User from "../models/user.js";
import dateLib from "../libraries/date_lib.js";
import bcrypt from "bcrypt";
import validators from "../libraries/validators.js";

const usersRouter = Router();

usersRouter.post("/", async (req, res) => {
  const body = req.body;
  if (!(body.username && body.password && body.name)) {
    return res.status(400).json({ error: "missing content" });
  }
  const { username, name, password } = body;

  if (
    !validators.validateAll({
      username: username,
      password: password,
      name: name,
    })
  ) {
    return res
      .status(400)
      .json({ error: "failed to meet user specification requirements" });
  }
  const userRegex = new RegExp(`^${username}$`, "i");
  const checkDup = await User.findOne({ username: { $regex: userRegex } });
  console.log(username, checkDup);
  if (checkDup !== null) {
    return res.status(400).json({ error: "username already exists" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const created = dateLib.newDateEST();

  const user = new User({
    username,
    name,
    created,
    passwordHash,
  });

  const savedUser = await user.save();
  res.status(201).json(savedUser);
});

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("games", {
    number: 1,
    sequence: 1,
    score: 1,
    order: 1,
    tries: 1,
    date: 1,
  });
  res.json(users);
});

export default usersRouter;
