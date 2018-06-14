require("dotenv").config(); // configure dotenv
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 12344;
const app = express();
app.use(cors());

const basicStats = require("./basicStats");
app.use(basicStats);

const aggregateMatch = require("./aggregateMatch");
app.use(aggregateMatch);

const mostPlayed = require("./mostPlayed");
app.use(mostPlayed);

const currentMatch = require("./currentMatch");
app.use(currentMatch);

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
