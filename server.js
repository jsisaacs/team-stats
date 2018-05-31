const express = require("express");
const requestPromise = require('request-promise');
const cors = require("cors");
const queryString = require("query-string");
const path = require("path");
const port = process.env.PORT || 12344;
const publicPath = path.join(__dirname, ".", "public");

const app = express();
app.use(cors());

/*
  Endpoint to recieve basic statistics about a summoner.
*/

app.get("/summoner-stats/:summonerName", (req, res) => {
  
  //JSON to be returned
  const summonerStats = {
    name: undefined,
    id: undefined,
    tier: undefined,
    rank: undefined,
    leaguePoints: undefined,
    winrate: undefined,
    hotStreak: undefined,
  };

  /*
    summoner/v3/summoners/by-name/{summonerName}
  */

 const summonerRequestOptions = {
  uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}`,
  qs: {
    api_key: 'RGAPI-4de9efd3-9817-4c88-8788-8084c88173c8'
  },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true
}

/*
  league/v3/positions/by-summoner/{summonerId}
*/

const leagueRequestOptions = {
  uri: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerStats.id}`,
  qs: {
    api_key: 'RGAPI-4de9efd3-9817-4c88-8788-8084c88173c8'
  },
  headers: {
    'User-Agent': 'Request-Promise'
  },
  json: true
}

let summmonerRequest = function () {
  let summonerRequestPromise = new Promise (
    function request() {
      requestPromise(summonerRequestOptions)
      .then(function (summonerRes) {
        summonerStats.name = summonerRes.name;
        summonerStats.id = summonerRes.id;
        res.json(summonerStats)
      })
      .catch(function (error) {
        console.log("Error making request to Summoner-V3.");
      })
    }
  );
}

let leagueRequest = function () {
  let leagueRequestPromise = new Promise (
    function request() {
      requestPromise(leagueRequestOptions)
      .then(function (leagueRes) {
        res.send("SUCCESS")
      })
      .catch(function (error) {
        console.log("Error making request to League-V3.");
      })
    }
  );
}

summmonerRequest()
  .then(leagueRequest());

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
