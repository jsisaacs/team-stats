require('dotenv').config()  // configure dotenv
const express = require("express")
const rp = require('request-promise')
const cors = require("cors")
const _kayn = require('kayn')
const Kayn = _kayn.Kayn
const REGIONS = _kayn.REGIONS
const path = require("path")
const port = process.env.PORT || 12344
const publicPath = path.join(__dirname, ".", "public")

const app = express()
app.use(cors())

const kayn = Kayn(process.env.API_KEY)({
  region: 'na',
    debugOptions: {
        isEnabled: true,
        showKey: false,
    },
    requestOptions: {
        shouldRetry: true,
        numberOfRetriesBeforeAbort: 3,
        delayBeforeRetry: 1000,
    },
    cacheOptions: {
        cache: null
    }
})

/*
  Endpoint aggregating match data for a given summoner name and champion id.
*/

app.get("/match-aggregations/:summonerName/:championId", (req, res) => {
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
            matchDataRequests.push(
              kayn.Match
              .get(match.gameId)
            )
          })
             
          Promise.all(matchDataRequests)
            .then(matchData => {
              res.json(matchData);
            })
        })
        .catch(error => {
          console.log(`${error.statusCode}: Error accessing match timeline.`);
        });
    })
    .catch(error => {
      console.log(`${error.statusCode}: Error accessing summoner data.`);
    });
});

/*
  Endpoint to recieve basic statistics about a summoner.
*/

app.get("/summoner-stats/:summonerName", (req, res) => {

  //JSON to be returned
  const summonerStats = {
    name: 'Player not found',
    id: -1,
    accountId: -1,
    tier: null,
    rank: null,
    leaguePoints: null,
    winrate: null,
    hotStreak: null,
    error: null,
  }

  /*
    summoner/v3/summoners/by-name/{summonerName}
  */

  const summonerRequestOptions = {
    uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}`,
    qs: {
      api_key: process.env.API_KEY
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }

  /*
    league/v3/positions/by-summoner/{summonerId}
  */

  const leagueRequest = (id) => (
    leagueRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${id}`,
      qs: {
        api_key: process.env.API_KEY
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  );

  rp(summonerRequestOptions)
    .then(response => {
      summonerStats.name = response.name;
      summonerStats.id = response.id;
      summonerStats.accountId = response.accountId;
      rp(leagueRequest(summonerStats.id))
        .then(response => {
          //Get the solo Queue info
          const soloQueue = response.filter(league => league.queueType === 'RANKED_SOLO_5x5')[0];
          summonerStats.tier = soloQueue.tier;
          summonerStats.rank = soloQueue.rank;
          summonerStats.leaguePoints = soloQueue.leaguePoints;
          summonerStats.hotStreak = soloQueue.hotStreak;
          res.json(summonerStats);
        })
        .catch(error => {
          console.log(error.message + ' ----- Error happened while accessing League-v3')
          res.json(summonerStats)
        })
    })
    .catch(error => {
      console.log(error.message + ' ----- Error happened while accessing Summoner-v3');
      res.json(summonerStats)
    });
});

/*
  Current match data for a given summoner
*/

app.get("/current-match/:summonerName", (req, res) => {

  /*
    summoner-stats/{summonerName}
  */

  const summonerStatsRequest = (summonerName) => (
    summonerStatsRequestOptions = {
      uri: `http://localhost:12344/summoner-stats/${summonerName}`,
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  );

  /*
    spectator/v3/active-games/by-summoner/{summonerId}
  */

  const spectatorRequest = (summonerId) => (
    spectatorRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/${summonerId}`,
      qs: {
        api_key: process.env.API_KEY
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  );

  rp(summonerStatsRequest(req.params.summonerName))
    .then(response => {
      res.json(response);
      rp(spectatorRequest(response.id))
        .then(response => {
          res.json(response);
        })
        .catch(error => {
          console.log(error.statusCode);
          if (error.statusCode === 404) {
            console.log("The summoner isn't currrently in a game.")
          }
        });
    })
    .catch(error => {

    });

});

app.listen(port, () => {
  console.log("running at http://localhost:" + port)
});