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

const getChampionName = championId => {
  const getChampion = champions.filter(champion => {
    return champion.key === championId;
  });
  return getChampion[0].name; 
}

/*
  Returns the participants of the current match, their championId, and the game's platformId. If the summoner isn't in a game, returns 404.
*/
router.get("/current-match/:region/:summonerName", (req, res) => {
  const currentMatch = async () => {
    try {
      const match = {
        participants: {
          team1: [],
          team2: [],
        }
      }
  
      const { id } = await kayn.Summoner.by.name(req.params.summonerName).region(req.params.region);

      const currentGame = await kayn.CurrentGame.by.summonerID(id).region(req.params.region);

      if (currentGame.gameQueueConfigId === 420) {
        currentGame.participants.map(participant => {
          const summoner = {
            team: participant.teamId,
            summonerName: participant.summonerName,
            summonerId: participant.summonerId,
            championId: participant.championId,
            championName: getChampionName(String(participant.championId)),
            expanded: false,
            isLoaded: false,
            championStatistics: {
              championRank: null,
              championName: null,
              championId: null,
              wins: null,
              losses: null,
              kda: {
                kills: null,
                deaths: null,
                assists: null
              },
              gold: null,
              cs: null,
              maxKills: null,
              maxDeaths: null,
              averageDamageDealt: null,
              averageDamageTaken: null,
              doubleKill: null,
              tripleKill: null,
              quadraKill: null,
              pentaKill: null,
              badges: {
                hotStreak: null,
                mastery6: null,
                mastery7: null,
                newbie: null,
                fiftyGames: null,
                veteran: null,
                sixtyPlusWinrate: null,
                highDamage: null,
                goldMachine: null,
                safePlayer: null,
                terrible: null,
                strongKDA: null,
                excellentKDA: null,
                inPromos: null
              },
              championRating: null,
              tier: null,
              rank: null             
            }
          }

          if (participant.teamId === 100) {
            match.participants.team1.push(summoner);
          } else {
            match.participants.team2.push(summoner);
          }
        });

        res.json(match);
        console.log('200: Success accessing /current-match.')   
      } else {
        res.json(404);
        console.log("404: Current game exists, but is not 5v5 Ranked Solo.")
      }  
    } catch (error) {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing /current-match.`);
    }
  }
  currentMatch();
});

module.exports = router;