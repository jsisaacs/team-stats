const express = require("express");
const router = express.Router();
const rp = require("request-promise");

/*
  Returns the participants of the current match, their championId, and the game's platformId. If the summoner isn't in a game, returns 404.
*/
router.get("/current-match/:summonerName", (req, res) => {
  const currentMatch = {
    participants: {
      team1: [],
      team2: [],
    },
    platformId: ''
  }

  /*
    summoner-info/{summonerName}
  */

  const summonerInfoRequest = summonerName =>
    (summonerInfoRequestOptions = {
      uri: `http://localhost:12344/summoner-info/${summonerName}`,
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    });

  /*
    spectator/v3/active-games/by-summoner/{summonerId}
  */

  const spectatorRequest = summonerId =>
    (spectatorRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${summonerId}`,
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
      rp(spectatorRequest(response.id))
        .then(response => {
          if (response.gameQueueConfigId === 420) {
            response.participants.map(participant => {
              const summoner = {
                summonerId: participant.summonerId,
                championId: participant.championId
              }
              
              if (participant.teamId === 100) {
                currentMatch.participants.team1.push(summoner);
              } else {
                currentMatch.participants.team2.push(summoner);
              }
            }) 
            currentMatch.platformId = response.platformId;
            res.json(currentMatch);
          } else {
            res.json("404: Summoner is not playing ranked.")
          }
        })
        .catch(error => {
          res.json(error.statusCode);
          console.log(`${error.statusCode}: Error accessing Spectator-v3.`);
        });
    })
    .catch(error => {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing summoner-info data.`);
    });
});

module.exports = router;
