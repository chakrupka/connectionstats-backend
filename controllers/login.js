// Router for user authentication
// Cha Krupka, Spring 2024
// Adapted from FullstackOpen

import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const loginRouter = Router();

loginRouter.post("/", async (req, res) => {
  const { username, password } = req.body;

  const userRegex = new RegExp(`^${username}$`, "i");
  const user = await User.findOne({ username: { $regex: userRegex } });
  const passwordCorrect =
    user == null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  const tokenUser = {
    username: user.username,
    id: user._id,
  };

  const token = jwt.sign(tokenUser, process.env.SECRET, { expiresIn: "1y" });

  res.status(200).send({ token, username: user.username, name: user.name });
});

export default loginRouter;
