const express = require("express");
const router = express.Router();
const _kayn = require("kayn");
const Kayn = _kayn.Kayn;
const REGIONS = _kayn.REGIONS;

const kayn = Kayn(process.env.API_KEY)({
  region: "na",
  debugOptions: {
    isEnabled: true,
    showKey: false
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000
  },
  cacheOptions: {
    cache: null
  }
});

/*
  Endpoint aggregating match data for a given summoner name and champion id.
*/
router.get("/match-aggregations/:summonerName/:championId", (req, res) => {
  matchAggregations = {
    winRate: -1
  };

  function getTeam(champId, match) {
    match.participants.map(participant => {
      if (participant.championId === champId) {
        return participant.teamId;
      }
    });
  }

  function getWinRate(matchData) {
    let wins = 0;
    let losses = 0;
    matchData.map(match => {
      const team = getTeam(req.params.championId, match);
      console.log(team);
    });
  }

  kayn.Summoner.by
    .name(req.params.summonerName)
    .then(response => {
      kayn.Matchlist.by
        .accountID(response.accountId)
        .query({
          endIndex: 20,
          champion: req.params.championId,
          queue: 420,
          season: 11
        })
        .then(response => {
          const matchDataRequests = [];

          response.matches.map(match => {
            matchDataRequests.push(kayn.Match.get(match.gameId));
          });

          Promise.all(matchDataRequests).then(matchData => {
            //matchAggregations.winRate = getWinRate(matchData);
            res.json("WOW");
          });
        })
        .catch(error => {
          console.log(`${error.statusCode}: Error accessing match timeline.`);
        });
    })
    .catch(error => {
      console.log(`${error.statusCode}: Error accessing summoner data.`);
    });
});

module.exports = router;
