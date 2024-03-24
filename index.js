const express = require("express");
const gTTS = require("gtts");
const fs = require("fs");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Set the views directory
app.set("views", path.join(__dirname, "views"));

// Set EJS as the view engine
app.set("view engine", "ejs");

// Render the index page
app.get("/", (req, res) => {
  res.render("index");
});

// Handle form submission
app.post("/convert", (req, res) => {
  const text = req.body.text;
  const language = req.body.language || "en"; // Default to English if no language selected

  // Check if text is provided
  if (!text) {
    res.status(400).send("Text is required");
    return;
  }

  const gtts = new gTTS(text, language);
  const filename = "speech.mp3";

  gtts.save(filename, function (err, result) {
    if (err) {
      res.status(500).send("Error converting text to speech");
      return;
    }

    console.log("Text to speech converted!");

    // Provide a link to download the MP3 file
    res.download(filename, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      // Delete the file after download
      fs.unlink(filename, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log("File deleted successfully");
      });
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
