const express = require("express");
const router = express.Router();
const rp = require("request-promise");
/*
  Endpoint to recieve basic statistics about a summoner.
*/
router.get("/summoner-stats/:summonerName", (req, res) => {
  //JSON to be returned
  const summonerStats = {
    name: "Player not found",
    id: -1,
    accountId: -1,
    tier: null,
    rank: null,
    leaguePoints: null,
    winrate: null,
    hotStreak: null,
    error: null
  };

  /*
    summoner/v3/summoners/by-name/{summonerName}
  */

  const summonerRequestOptions = {
    uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${
      req.params.summonerName
    }`,
    qs: {
      api_key: process.env.API_KEY
    },
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true
  };

  /*
    league/v3/positions/by-summoner/{summonerId}
  */

  const leagueRequest = id =>
    (leagueRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${id}`,
      qs: {
        api_key: process.env.API_KEY
      },
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    });

  rp(summonerRequestOptions)
    .then(response => {
      summonerStats.name = response.name;
      summonerStats.id = response.id;
      summonerStats.accountId = response.accountId;
      rp(leagueRequest(summonerStats.id))
        .then(response => {
          //Get the solo Queue info
          const soloQueue = response.filter(
            league => league.queueType === "RANKED_SOLO_5x5"
          )[0];
          summonerStats.tier = soloQueue.tier;
          summonerStats.rank = soloQueue.rank;
          summonerStats.leaguePoints = soloQueue.leaguePoints;
          summonerStats.hotStreak = soloQueue.hotStreak;
          res.json(summonerStats);
        })
        .catch(error => {
          console.log(
            error.message + " ----- Error happened while accessing League-v3"
          );
          res.json(summonerStats);
        });
    })
    .catch(error => {
      console.log(
        error.message + " ----- Error happened while accessing Summoner-v3"
      );
      res.json(summonerStats);
    });
});

module.exports = router;
