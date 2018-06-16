const express = require("express");
const router = express.Router();
const rp = require("request-promise");

router.get("/badges/:summonerName/:championName", (req, res) => {
  const badges = {
    hotStreak: false,
    coldStreak: false,
    mastery6: false,
    mastery7: false,
    fiftyGames: false,
    hundredGames: false,
    sixtyPlusWinrate: false,
    safePlayer: false,
    hardStuck: false,
    highDamage: false,
    terrible: false,
  }
  
  const summonerInfoRequest = summonerName =>
    (summonerInfoRequestOptions = {
      uri: `http://localhost:12344/summoner-info/${summonerName}`,
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    });

  const championMasteryRequest = (summonerId, championId) => (
    championMasteryRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/champion-mastery/v3/champion-masteries/by-summoner/${summonerId}/by-champion/${championId}`,
      qs: {
        api_key: process.env.API_KEY
      },
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
      });
    
  const championStatisticsRequest = (summonerName, championName) => 
    (championStatisticsRequestOptions = {
      uri: `http://localhost:12344/champion-statistics/${summonerName}/${championName}`,
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    });
});

module.exports = router;