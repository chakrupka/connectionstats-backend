import mongoose from "mongoose";
import newDate from "./utils/date.js";

if (process.argv.length < 3) {
  console.log("Give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://ck238:${password}@constatdev.bwkthzo.mongodb.net/?retryWrites=true&w=majority&appName=ConStatDev`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const gridSchema = new mongoose.Schema({
  tag: Number,
  grid: String,
  score: Number,
  date: String,
});

const Grid = mongoose.model("Grid", gridSchema);

const note = new Grid({
  tag: 323,
  grid: "pppp.bbbb.gggg.yyyy",
  score: 30,
  date: newDate(),
});

note.save().then((res) => {
  console.log("Grid saved");
  mongoose.connection.close();
});
