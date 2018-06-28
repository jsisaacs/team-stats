const express = require("express");
const router = express.Router();
const rp = require("request-promise");

function calculateChampionRating(gameNumber, winRate, mastery, damageDealt, damageTaken, kdaRatio, rank) {
  //TODO
}

router.get("/badges/:summonerName/:championName", (req, res) => {
  const result = {
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
      excellentKDA: false
    },
    championRating: 85
  }

  const championStatisticsRequest = (summonerName, championName) => 
  (championStatisticsRequestOptions = {
    uri: `http://localhost:12344/champion-statistics/${summonerName}/${championName}`,
    headers: {
      "User-Agent": "Request-Promise"
    },
    json: true
  });

  const championMasteryRequest = (summonerName, championName) => (
    championMasteryRequestOptions = {
      uri: `http://localhost:12344/champion-mastery/${summonerName}/${championName}`,
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    }
  );

  rp(championStatisticsRequest(req.params.summonerName, req.params.championName))
    .then(responseStats => {
      const gameNumber = responseStats[0].wins + responseStats[0].losses;
      const winRate = Number(Number((responseStats[0].wins / gameNumber) * 100).toFixed(2));
      const gold = responseStats[0].gold;
      const damage = responseStats[0].averageDamageDealt;
      const kills = responseStats[0].kda.kills;
      const deaths = responseStats[0].kda.deaths;
      const assists = responseStats[0].kda.assists;
      const kdaRatio = (kills + assists) / deaths;
      rp(championMasteryRequest(req.params.summonerName, req.params.championName))
        .then(response => {
          result.badges.hotStreak = response.hotStreak;
          if (response.championLevel === 6) {
            result.badges.mastery6 = true;
          }
          if (response.championLevel === 7) {
            result.badges.mastery7 = true;
          }
          if (gameNumber <= 15) {
            result.badges.newbie = true;
          }
          if (gameNumber >= 50 && gameNumber < 100) {
            result.badges.fiftyGames = true;
          }
          if (gameNumber >= 100) {
            result.badges.hundredGames = true;
          }
          if (winRate >= 60) {
            result.badges.sixtyPlusWinrate = true;
          }
          if (winRate <= 42 && gameNumber >= 15) {
            result.badges.terrible = true;
          }
          if (kdaRatio >= 3 && kdaRatio < 4) {
            result.badges.strongKDA = true;
          }
          if (kdaRatio >= 4) {
            result.badges.excellentKDA = true;
          }
          if (gold > 12000) {
            result.badges.goldMachine = true;
          }
          if (damage >= 120000) {
            result.badges.highDamage = true;
          }
          res.json(result);
        })
        .catch(error => {
          console.log(`${error.statusCode}: Error accessing champion mastery data.`);
        });
    })
    .catch(error => {
      console.log(`${error.statusCode}: Error accessing champion badges.`);
    });
});

module.exports = router;