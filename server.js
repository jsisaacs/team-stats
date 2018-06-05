const express = require("express")
const rp = require('request-promise')
const cors = require("cors")
const queryString = require("query-string")
const path = require("path")
const port = process.env.PORT || 12344
const publicPath = path.join(__dirname, ".", "public")

const app = express()
app.use(cors())

var apiKey = 'RGAPI-3db88058-a7d2-47bf-bce7-9e7c75b9f6c5';

/*
  Endpoint to recieve basic statistics about a summoner.
*/

app.get("/summoner-stats/:summonerName", (req, res) => {

  //JSON to be returned
  const summonerStats = {
    name: undefined,
    id: undefined,
    accountId: undefined,
    tier: undefined,
    rank: undefined,
    leaguePoints: undefined,
    winrate: undefined,
    hotStreak: undefined,
  }

  /*
    summoner/v3/summoners/by-name/{summonerName}
  */
 
  const summonerRequestOptions = {
    uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}`,
    qs: {
      api_key: apiKey
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
          api_key: apiKey
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
          console.log(error.statusCode);
          console.log("Error accessing League-v3");
        })
    })
    .catch(error => {
      console.log(error.statusCode);
      console.log("Error accessing Summoner-v3");
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
        api_key: apiKey
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

/*
  Endpoint aggregating match data for a given summoner name.
*/

app.get("/match-aggregations/:summonerName", (req, res) => {

  const matchAggregations = {
    currentGameId: '',
  }

  /*
    summoner/v3/summoners/by-name/{summonerName}
  */
 
  const summonerRequestOptions = {
    uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}`,
    qs: {
      api_key: apiKey
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }

  /*
    summoner/v3/match/matchlists/by-account/{accountId}
  */

  const matchRequest = (accountId, championId) => (
    matchRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}`,
      qs: {
        champion: championId,
        queue: 420,
        season: 11,
        api_key: apiKey
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  );

  /*
    static-data/v3/champions/{id}
  */

  const championsRequest = (id) => (
    championsRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/static-data/v3/champions/${id}`,
      qs: {
        api_key: apiKey
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  );
});


app.listen(port, () => {
  console.log("running at http://localhost:" + port)
});