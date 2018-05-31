const express = require("express");
const requestPromise = require('request-promise');
const cors = require("cors");
const queryString = require("query-string");
const path = require("path");
const port = process.env.PORT || 12344;
const publicPath = path.join(__dirname, ".", "public");

const app = express();
app.use(cors());

/*
  Endpoint to recieve basic statistics about a summoner.
*/

app.get("/summoner-stats/:summonerName", (req, res) => {
  
  //JSON to be returned
  const summonerStats = {
    name: undefined,
    id: undefined,
    tier: undefined,
    rank: undefined,
    leaguePoints: undefined,
    winrate: undefined,
    hotStreak: undefined,
  };

  /*
    summoner/v3/summoners/by-name/{summonerName}
  */

  const summonerRequestOptions = {
    uri: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}`,
    qs: {
      api_key: 'RGAPI-4de9efd3-9817-4c88-8788-8084c88173c8'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }

  /*
    league/v3/positions/by-summoner/{summonerId}
  */

  const leagueRequestOptions = {
    uri: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerStats.id}`,
    qs: {
      api_key: 'RGAPI-4de9efd3-9817-4c88-8788-8084c88173c8'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }

  requestPromise(summonerRequestOptions)
    .then(response => {
      summonerStats.name = response.name;
      summonerStats.id = response.id;
      
      //TEST
      res.json(summonerStats);

      if (summonerStats.id !== undefined) {
        // requestPromise(leagueRequestOptions)
        //   .then(response => {
        //     console.log("League-V3 reached")
        //     res.send(response);
        //   })
        //   .catch(error => {
        //     console.log(error)
        //   });
      } else {
        console.log("Can't call League-V3 because error making request to Summoner-V3.");
      }
  })
  .catch(error => {
    console.log("Error making request to Summoner-V3.");
  });
});

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});