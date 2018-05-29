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
    url: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${username}?api_key=RGAPI-9d489adc-104e-4562-a4fd-d8d09a5a7fad`,
    headers: {
      Origin: "https://developer.riotgames.com",
      "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
      "X-Riot-Token": "RGAPI-9d489adc-104e-4562-a4fd-d8d09a5a7fad",
      "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36"
    }
  };
  request.get(data, (error, response, body) => {
    res.send(body);
  });
});

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
