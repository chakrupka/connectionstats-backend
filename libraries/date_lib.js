/*
 * Various date utilities specific to ConStats
 * Cha Krupka, Spring 2024
 * Update June 2024
 */

import { DateTime } from "luxon";

const newDateEST = () => {
  const dt = DateTime.now().setZone("America/New_York");
  return dt.toFormat("yyyy-LL-dd");
};

// Input is a string of format "YYYY-MM-DD" (ex: "2024-11-19")
const prettyStrDate = (dateStr) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateValues = dateStr.split("-");
  const month = months[parseInt(dateValues[1]) - 1];
  const day = parseInt(dateValues[2]);

  return `${month} ${day}, ${dateValues[0]}`;
};

// Input is a string of format "YYYY-MM-DD" (ex: "2024-11-19")
const dateToUnix = (dateString) => {
  const dt = DateTime.fromISO(dateString).setZone("America/New_York");
  return dt.toSeconds();
};

// Input is a number of seconds
const unixToDate = (seconds) => {
  const dt = DateTime.fromSeconds(seconds).setZone("America/New_York");
  return dt.toFormat("yyyy-LL-dd");
};

// Input is an array of date strings in format "YYYY-MM-DD" (ex: "2024-11-19")
const sortDates = (games) => {
  const todaysDate = dateLib.newDate();
  const dates = games.map((game) => dateLib.dateToUnix(game.date));
  dates.sort();
  const sortedDates = dates.map((date) => dateLib.unixToDate(date));
  return sortedDates;
};

// Input is two date strings in format "YYYY-MM-DD" (ex: "2024-11-19")
const areDayApart = (date1, date2) => {
  return (
    dateLib.dateToUnix(date1) + 86400 === dateLib.dateToUnix(date2) ||
    dateLib.dateToUnix(date1) === dateLib.dateToUnix(date2) + 86400
  );
};

const getTodayPuzzleNum = () => {
  const firstDate = DateTime.fromISO("2023-06-11");
  const testDate = DateTime.fromISO("2023-06-11").setZone("America/New_York");
  const todayDate = DateTime.now().setZone("America/New_York");

  console.log("First Date:", firstDate.toISO());
  console.log("Test Date:", testDate.toISO());
  console.log("Today Date:", todayDate.toISO());

  console.log(
    firstDate.toLocaleString(),
    testDate.toLocaleString(),
    todayDate.toLocaleString()
  );

  const diffFirstToday = firstDate.diff(todayDate, "day").toObject().days;
  const diffTestToday = testDate.diff(todayDate, "day").toObject().days;

  console.log("Difference (First - Today):", diffFirstToday);
  console.log("Difference (Test - Today):", diffTestToday);

  console.log(Math.floor(-diffFirstToday));
  console.log(-diffTestToday);

  return Math.floor(-diffFirstToday);
};

// Input is a string of format "YYYY-MM-DD" (ex: "2024-11-19")
const dateToPuzzleNum = (dateStr) => {
  const firstDate = DateTime.fromISO("2023-06-11");
  const puzzleDate = DateTime.fromISO(dateStr).setZone("America/New_York");
  return Math.floor(-firstDate.diff(puzzleDate, "day").toObject().days);
};

const puzzleNumToDate = (number) => {
  const firstDate = DateTime.fromISO("2023-06-11");
  return firstDate.plus({ days: number }).toFormat("yyyy-LL-dd");
};

export default {
  newDateEST,
  prettyStrDate,
  dateToUnix,
  unixToDate,
  sortDates,
  areDayApart,
  getTodayPuzzleNum,
  dateToPuzzleNum,
  puzzleNumToDate,
};
