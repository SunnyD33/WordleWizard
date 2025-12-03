import fs from "fs";

// Read the text file
const words = fs
  .readFileSync("../src/data/wordle-answers.txt", "utf-8")
  .split("\n") // Split by newlines
  .map((word) => word.trim()) // Remove any extra whitespace
  .filter((word) => word.length > 0); // Remove empty lines

// Create the JavaScript file content
const jsContent = `export const WORDLE_ANSWERS = ${JSON.stringify(words, null, 2)};\n`;

// Write to wordList.js
fs.writeFileSync("../src/data/wordList.js", jsContent);

console.log(`Converted ${words.length} words!`);
