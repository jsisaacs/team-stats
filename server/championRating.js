const express = require("express");
const router = express.Router();
const rp = require("request-promise");

router.get("/champion-rating/:summonerName/:championName", (req, res) => {
  const championRating = {
    summonerName: undefined,
    championName: undefined,
    championId: undefined,
    championScore: undefined
  }

  const championMasteryRequest = (summonerName, championName) =>
    (championMasteryRequestOptions = {
      uri: `http://localhost:12344/champion-mastery/${summonerName}/${championName}`,
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
  
  rp(championMasteryRequest(req.params.summonerName, req.params.championName))
    .then(response => {
      rp(championStatisticsRequest(req.params.summonerName, req.params.championName))
        .then(response => {
          championRating.summonerName = req.params.summonerName;
          championRating.championName = req.params.championName;
          championRating.championId = response.championId;
          
          res.json(championRating);
        })
        .catch(error => {

        });
    })
    .catch(error => {

    });
});

module.exports = router;