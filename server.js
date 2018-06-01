const express = require("express");
const rp = require('request-promise');
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
      api_key: 'RGAPI-7b26bf63-d297-4e54-b54d-bad9081f99f0'
    },
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }

  /*
    league/v3/positions/by-summoner/{summonerId}
  */

  const leagueRequestOptions = (id) => (
    {
      uri: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${id}`,
      qs: {
        api_key: 'RGAPI-7b26bf63-d297-4e54-b54d-bad9081f99f0'
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  )

  rp(summonerRequestOptions)
    .then(response => {
      summonerStats.name = response.name;
      summonerStats.id = response.id;
      console.log(summonerStats)
      rp(leagueRequestOptions(summonerStats.id))
        .then(response => {

          summonerStats.tier = response[0].tier
          summonerStats.rank = response[0].rank
          summonerStats.leaguePoints = response[0].leaguePoints
          summonerStats.hotStreak = response[0].hotStreak
          res.json(summonerStats)
        })
        .catch(e => console.log('GG'))
    })
    .catch(error => {
      console.log('WP')
    });

});

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});