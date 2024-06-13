/*
 * Authenticator for user token in request
 * Cha Krupka, June 2024
 */

import User from "../models/user.js";
import jwt from "jsonwebtoken";

const getToken = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
};

const verifyAndGetUser = async (req, res) => {
  const decodedToken = jwt.verify(getToken(req), process.env.SECRET);
  if (!decodedToken.id) {
    res.status(401).json({ error: "token invalid" });
    return null;
  }
  const user = await User.findById(decodedToken.id);
  if (!user) {
    res.status(404).end();
    return null;
  }

  return user;
};

export default verifyAndGetUser;
