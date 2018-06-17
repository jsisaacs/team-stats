const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const champions = require("lol-champions");

const getChampionId = championName => {
  const getChampion = champions.filter(champion => {
    return champion.name === championName;
  });
  return getChampion[0].key; 
}

router.get("/champion-mastery/:summonerName/:championName", (req, res) => {
  const championMastery = {
    summonerId: undefined,
    championId: undefined,
    championLevel: undefined,
    hotStreak: undefined
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

  rp(summonerInfoRequest(req.params.summonerName))
    .then(response => {
      const champId = getChampionId(req.params.championName);
      championMastery.hotStreak = response.hotStreak;
      return rp(championMasteryRequest(response.id, champId));
    })
    .then(response => {
      championMastery.summonerId = response.playerId;
      championMastery.championId = response.championId;
      championMastery.championLevel = response.championLevel;
      res.json(championMastery);
    })
    .catch(error => {
      console.log(`${error.statusCode}: Error accessing champion mastery data.`);
    });
});

module.exports = router;