const express = require("express")
const rp = require('request-promise')
const cors = require("cors")
const queryString = require("query-string")
const path = require("path")
const port = process.env.PORT || 12344
const publicPath = path.join(__dirname, ".", "public")

const app = express()
app.use(cors())

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
      api_key: 'RGAPI-3db88058-a7d2-47bf-bce7-9e7c75b9f6c5'
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
          api_key: 'RGAPI-3db88058-a7d2-47bf-bce7-9e7c75b9f6c5'
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
  Endpoint about a summoner's current champion
*/

app.get("/current-champion/:summonerName", (req, res) => {
  const currentChampion = {
    name: undefined,
  }

  /*
    summoner/v3/summoners/by-name/{summonerName}
  */
 
  const summonerRequestOptions = {
    uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}`,
    qs: {
      api_key: 'RGAPI-3db88058-a7d2-47bf-bce7-9e7c75b9f6c5'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }

  /*
    summoner/v3/match/matchlists/by-account/{accountId}
  */

  const matchRequest = (accountId) => (
    matchRequestOptions = {
      uri: `https://na1.api.riotgames.com/lol/match/v3/matchlists/by-account/${accountId}`,
      qs: {
        api_key: 'RGAPI-3db88058-a7d2-47bf-bce7-9e7c75b9f6c5'
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
        api_key: 'RGAPI-3db88058-a7d2-47bf-bce7-9e7c75b9f6c5',
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  );

  rp(summonerRequestOptions)
    .then(response => {
      const accountId = response.accountId;

      rp(matchRequest(accountId))
        .then(response => {
          const matches = response.matches;
          const latestMatch = matches[0];
          const championId = latestMatch.champion;

          rp(championsRequest(championId))
            .then(response => {
              currentChampion.name = response.name;
              res.json(currentChampion)
            })
            .catch(error => {

            });
        })
        .catch(error => {

        });
    })
    .catch(error => {
      console.log(error.statusCode);
      console.log("Error accessing Summoner-v3");
    });
});

app.get("/match-aggregations/:summonerName", (req, res) => {

});



app.listen(port, () => {
  console.log("running at http://localhost:" + port)
});