// Routes
const Hoard = require("./routes/hoard");

// To solve the cors issue
const cors = require("cors");

// Express App
const express = require("express");
const Update = require("./routes/update");
const app = express();

const port = process.env.PORT || 4500;

app.use(cors());

if (app.get("env") === "development") {
  app.locals.pretty = true;
}

app.get("/", (_, res) => {
  res.json({
    text: "[Welcome to the unofficial mushaf hefzmoyaser api! 😊]",
    routes: [
      {
        route: "/page",
        desc: "get all words in page.",
      },
    ],
  });
});

app.get("/search", async (req, res) => {
  const query = req.query.q.replace(/[^a-zA-Z0-9 ]/g, "");
  const episode = req.query.ep;
  const result = await getKitsu(query, episode)
  res.send(result);
});

app.get("/hoard", async (req, res) => {
  await Hoard()
  res.json({status: "finished"})
})

app.get("/Update", async (req, res) => {
  const msg = await Update()
  res.json({status: msg})
})


app.listen(port, () => console.log(`Server started at ${port}`));

module.exports = app;
