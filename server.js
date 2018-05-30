const express = require("express");
const request = require("request");
const cors = require("cors");
const queryString = require("query-string");
const path = require("path");
const port = process.env.PORT || 12344;
const publicPath = path.join(__dirname, ".", "public");
const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("bullshit");
});
app.get("/summoner/:username", (req, res) => {
  console.log("got the request");
  const username = req.params.username;
  const data = {
    url: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${username}?api_key=RGAPI-05fc1dea-5fcc-40d3-b7c1-0e3fe69a8b55`,
  };
  request.get(data, (error, response, body) => {
    res.send(body);
  });
});



app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
