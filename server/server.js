require("dotenv").config(); // configure dotenv
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 12344;
const app = express();
app.use(cors());

const summonerInfo = require("./summonerInfo");
app.use(summonerInfo);

const championStatistics = require("./championStatistics");
app.use(championStatistics);

const currentMatch = require("./currentMatch");
app.use(currentMatch);

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
