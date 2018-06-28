require("dotenv").config(); // configure dotenv
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 12344;
const app = express();
app.use(cors());

const summonerInfo = require("./summonerInfo");
app.use(summonerInfo);

const currentMatch = require("./currentMatch");
app.use(currentMatch);

const championStatistics = require("./championStatistics");
app.use(championStatistics);

const championMastery = require("./championMastery");
app.use(championMastery);

const badges = require("./badges");
app.use(badges);

const championRating = require("./championRating");
app.use(championRating);

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
