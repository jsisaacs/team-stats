const express = require("express");
const router = express.Router();
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
  Returns the participants of the current match, their championId, and the game's platformId. If the summoner isn't in a game, returns 404.
*/
router.get("/current-match/:region/:summonerName", (req, res) => {
  const currentMatch = async () => {
    try {
      const match = {
        participants: {
          team1: [],
          team2: [],
        },
        platformId: ''
      }
  
      const { id, accountId, name } = await kayn.Summoner.by.name(req.params.summonerName).region(req.params.region);
  
      const currentGame = await kayn.CurrentGame.by.summonerID(id).region(req.params.region);

      if (currentGame.gameQueueConfigId === 420) {
        currentGame.participants.map(participant => {
          const summoner = {
            summonerId: participant.summonerId,
            championId: participant.championId
          }

          if (participant.teamId === 100) {
            match.participants.team1.push(summoner);
          } else {
            match.participants.team2.push(summoner);
          }
        })
        
        match.platformId = currentGame.platformId;

        res.json(match);
        console.log('200: Success accessing /current-match.')   
      }  
    } catch (error) {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing /current-match.`);
    }
  }
  currentMatch();
});

module.exports = router;
