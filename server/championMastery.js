const express = require("express");
const router = express.Router();
const { Kayn } = require('kayn');
const champions = require("lol-champions");

const kayn = Kayn(process.env.RIOT_LOL_API_KEY)({
  debugOptions: {
    isEnabled: false,
    showKey: false,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
  },
});

const getChampionId = championName => {
  const getChampion = champions.filter(champion => {
    return champion.name === championName;
  });
  return getChampion[0].key; 
}

router.get("/champion-mastery/:region/:summonerName/:championName", (req, res) => {
  const championMastery = async () => {
    try {
      const { id, accountId, name } = await kayn.Summoner.by.name(req.params.summonerName).region(req.params.region);

      const championId = getChampionId(req.params.championName);

      const { playerId, championLevel } = await kayn.ChampionMastery.get(id)(championId).region(req.params.region);

      res.json({
        id: playerId,
        championId: championId,
        championLevel: championLevel
      });
      console.log('200: Success accessing /champion-mastery.');
    } catch (error) {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing /champion-mastery.`);
    }
  }
  championMastery();
});

module.exports = router;