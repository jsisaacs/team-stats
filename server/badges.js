const express = require("express");
const router = express.Router();
const { Kayn } = require('kayn');
const rp = require("request-promise");

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

const championStatisticsRequest = (region, summonerName, championName) => 
  (championStatisticsRequestOptions = {
    uri: `http://localhost:12344/champion-statistics/${region}/${summonerName}/${championName}`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    },
    json: true
  });
    
const championMasteryRequest = (region, summonerName, championName) => 
  (championMasteryRequestOptions = {
  uri: `http://localhost:12344/champion-mastery/${region}/${summonerName}/${championName}`,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
  },
  json: true
});

router.get("/badges/:region/:summonerName/:championName", (req, res) => {
  const badges = async () => {
    try {
      const response = {
        badges: {
          hotStreak: false,
          mastery6: false,
          mastery7: false,
          newbie: false,
          fiftyGames: false,
          veteran: false,
          sixtyPlusWinrate: false,
          highDamage: false,
          goldMachine: false,
          terrible: false,
          strongKDA: false,
          excellentKDA: false,
          inPromos: false
        },
        championRating: 85
      }

      const { id } = await kayn.Summoner.by.name(req.params.summonerName).region(req.params.region);
      
      const leaguePosition = await kayn.LeaguePositions.by.summonerID(String(id)).region(req.params.region);
      const { leaguePoints, hotStreak } = leaguePosition[0];

      const championStatistics = await rp(championStatisticsRequest(req.params.region, req.params.summonerName, req.params.championName));
      const championMastery = await rp(championMasteryRequest(req.params.region, req.params.summonerName, req.params.championName));

      const gameNumber = championStatistics.wins + championStatistics.losses;
      const winRate = Number(Number((championStatistics.wins / gameNumber) * 100).toFixed(2));
      const gold = championStatistics.gold;
      const damage = championStatistics.averageDamageDealt;
      const kills = championStatistics.kda.kills;
      const deaths = championStatistics.kda.deaths;
      const assists = championStatistics.kda.assists;
      const kdaRatio = (kills + assists) / deaths;
      
      response.badges.hotStreak = hotStreak;
      if (championMastery.championLevel === 6) {
        response.badges.mastery6 = true;
      }
      if (championMastery.championLevel === 7) {
        response.badges.mastery7 = true;
      }
      if (gameNumber <= 15) {
        response.badges.newbie = true;
      }
      if (gameNumber >= 50 && gameNumber < 100) {
        response.badges.fiftyGames = true;
      }
      if (gameNumber >= 100) {
        response.badges.hundredGames = true;
      }
      if (winRate >= 60) {
        response.badges.sixtyPlusWinrate = true;
      }
      if (winRate <= 42 && gameNumber >= 15) {
        response.badges.terrible = true;
      }
      if (kdaRatio >= 3 && kdaRatio < 4) {
        response.badges.strongKDA = true;
      }
      if (kdaRatio >= 4) {
        response.badges.excellentKDA = true;
      }
      if (gold > 12000) {
        response.badges.goldMachine = true;
      }
      if (damage >= 120000) {
        response.badges.highDamage = true;
      }
      if (leaguePoints === 100) {
        response.badges.inPromos = true;
      }

      res.json(response);
      console.log('200: Success accessing /badges.');
    } catch (error) {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing /badges.`);
    }
  }
  badges();
});

module.exports = router;