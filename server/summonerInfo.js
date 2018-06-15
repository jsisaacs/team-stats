const express = require("express");
const router = express.Router();
const rp = require("request-promise");
/*
  Endpoint to recieve basic info about a summoner.
*/
router.get("/summoner-info/:summonerName", (req, res) => {
  //JSON to be returned
  const summonerInfo = {
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
      summonerInfo.name = response.name;
      summonerInfo.id = response.id;
      summonerInfo.accountId = response.accountId;
      rp(leagueRequest(summonerInfo.id))
        .then(response => {
          const soloQueue = response.filter(
            league => league.queueType === "RANKED_SOLO_5x5"
          )[0];
          summonerInfo.tier = soloQueue.tier;
          summonerInfo.rank = soloQueue.rank;
          summonerInfo.leaguePoints = soloQueue.leaguePoints;
          summonerInfo.hotStreak = soloQueue.hotStreak;
          res.json(summonerInfo);
        })
        .catch(error => {
          res.json(error.statusCode);
          console.log(`${error.statusCode}: Error accessing League-v3.`);
        });
    })
    .catch(error => {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing Summoner-v3.`);
    });
});

module.exports = router;
