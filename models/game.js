import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  number: Number,
  sequence: Array,
  score: Number,
  order: Array,
  tries: Number,
  date: String,
});

gameSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

export default mongoose.model("Game", gameSchema);
