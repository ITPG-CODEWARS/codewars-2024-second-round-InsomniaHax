const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const express = require("express");
const cors = require("cors");
const {
  insertIntoDatabase,
  searchDatabase,
  connectDatabase,
} = require("./database.js");

const app = express();
const PORT = process.env.PORT || 5000;

connectDatabase();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "../../Frontend/build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../Frontend/build/static/index.html"));
});

app.listen(PORT, (error) => {
  if (error) console.log("Server Could not Start!" + error);
  else console.log("Server successfully started! Listening on port " + PORT);
});

app.get("/s/*", async (req, res) => {
  const url = req.params[0];
  const longURL = await searchDatabase(url);

  if (longURL !== null) res.redirect(longURL);
  else res.redirect("https://google.com");
});

app.post("/insert", async (req, res) => {
  const { shortURL, longURL, expireAfterSeconds } = req.body;

  const searchResult = await searchDatabase(shortURL);

  if (searchResult === null) {
    insertIntoDatabase(shortURL, longURL, expireAfterSeconds);
    res.end();
  } else res.status(409).json({ error: "Short Link Already Exists!" });
});

module.exports = app;
