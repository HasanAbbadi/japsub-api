require("dotenv").config()

// Routes
const Hoard = require("./routes/hoard");
const Search = require("./routes/search");
const Update = require("./routes/update");

// To solve the cors issue
const cors = require("cors");

// Express App
const express = require("express");
const app = express();

const port = process.env.PORT || 4500;

app.use(cors());

if (app.get("env") === "development") {
  app.locals.pretty = true;
}

app.get("/", (_, res) => {
  res.json({
    text: "[Big collection of japanese subtitles from various sources! 😊]",
    routes: [
      {
        route: "/hoard",
        desc: "Build the database.",
        options: {
          src: ["kitsu", "matchoo"]
        }
      },
      {
        route: "/update",
        desc: "Update the database.",
      },
      {
        route: "/search",
        desc: "Fuzzy find files and archives stored in the DB.",
        options: {
          q: "Your query (Show Title in romaji/japanese)",
          se: "(OPTIONAL) season number",
          ep: "(OPTIONAL) episode number"
        }
      },
    ],
  });
});

app.get("/search", async (req, res) => {
  const query = req.query.q;
  const episode = req.query.ep;
  const season = req.query.se;
  const result = Search(query, season, episode)
  res.send(result);
});

app.get("/hoard", async (req, res) => {
  if (req.query.pass != process.env.OAUTH) {
    res.json({status: "ERR: Unauthorized."})
    return
  }
  const source = req.query.src;

  await Hoard(source)
  res.json({status: "finished"})
})

app.get("/Update", async (req, res) => {
  const msg = await Update()
  res.json(msg)
})


app.listen(port, () => console.log(`Server started at ${port}`));

module.exports = app;
