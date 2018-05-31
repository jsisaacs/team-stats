const express = require("express");
const request = require("request");
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

  const summonerEndpointRequest = {
    url: `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${req.params.summonerName}?api_key=RGAPI-05fc1dea-5fcc-40d3-b7c1-0e3fe69a8b55`
  };
  
  request.get(summonerEndpointRequest, (error, response, body) => {
    if (response.statusCode === 200) {
      const jsonData = JSON.parse(body);
      summonerStats.name = jsonData.name;
      summonerStats.id = jsonData.id;
      res.json(jsonData)
    } else {
      console.log("Error making request to Summoner-V3.");
    }
  });

  /*
    league/v3/positions/by-summoner/{summonerId}
  */
  
  const leagueEndpointRequest = {
    url: `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerStats.id}?api_key=RGAPI-05fc1dea-5fcc-40d3-b7c1-0e3fe69a8b55`
  };

  //make sure the call to Summoner-V3 returned status 200
  if (summonerStats.id !== undefined) {
    request.get(leagueEndpointRequest, (error, response, body) => {
      const jsonData = JSON.parse(body);
      res.json(jsonData);
    });
  } else {
    console.log("Can't call League-V3 because error making request to Summoner-V3.");
  }
});   

app.listen(port, () => {
  console.log("running at http://localhost:" + port);
});
