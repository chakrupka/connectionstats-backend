// Helper functions for testing
// Cha Krupka Spring 2024 (Adapted from FullstackOpen)

import User from "../models/user.js";

export const usersInDB = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

export default { usersInDB };
