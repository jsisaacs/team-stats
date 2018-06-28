const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const { Kayn } = require('kayn');

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

/*
  Endpoint to recieve basic info about a summoner.
*/
router.get("/summoner-info/:region/:summonerName", (req, res) => {
  const summonerInfo = async () => {
    try {
      const { id, accountId, name } = await kayn.Summoner.by.name(req.params.summonerName).region(req.params.region);

      const leaguePosition = await kayn.LeaguePositions.by.summonerID(String(id)).region(req.params.region);
  
      const { tier, rank, leaguePoints, queueType, hotStreak, wins, losses } = leaguePosition[0];
  
      const winRate = Number((wins / (wins + losses) * 100).toFixed(2));
  
      res.json({
        id: id,
        accountId: accountId,
        name: name,
        tier: tier,
        rank: rank,
        leaguePoints: leaguePoints,
        queueType: queueType,
        hotStreak: hotStreak,
        winRate: winRate
      });
      console.log('200: Success accessing /summoner-info.');
    } 
    catch (error) {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing /summoner-info.`);
    }
  }
  summonerInfo();
});

module.exports = router;
