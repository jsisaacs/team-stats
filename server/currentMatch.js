const express = require("express");
const router = express.Router();
const rp = require("request-promise");

/*
  Current match data for a given summoner
*/
router.get("/current-match/:summonerName", (req, res) => {
  /*
    summoner-stats/{summonerName}
  */

  const summonerStatsRequest = summonerName =>
    (summonerStatsRequestOptions = {
      uri: `http://localhost:12344/summoner-stats/${summonerName}`,
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

  rp(summonerStatsRequest(req.params.summonerName))
    .then(response => {
      rp(spectatorRequest(response.id))
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          if (error.statusCode === 404) {
            res.json("The summoner isn't currrently in a game.");
          }
        });
    })
    .catch(err => console.log(err));
});

module.exports = router;
