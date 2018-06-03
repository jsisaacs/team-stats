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
      api_key: 'RGAPI-f7a35839-2c3d-4b01-9e00-05560d63edd4'
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
        api_key: 'RGAPI-f7a35839-2c3d-4b01-9e00-05560d63edd4'
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  )

  rp(summonerRequestOptions)
    .then(response => {
      summonerStats.name = response.name
      summonerStats.id = response.id
      rp(leagueRequestOptions(summonerStats.id))
        .then(response => {
          //Get the solo Queue info
          const soloQueue = response.filter(league => league.queueType === 'RANKED_SOLO_5x5')[0]

          summonerStats.tier = soloQueue.tier
          summonerStats.rank = soloQueue.rank
          summonerStats.leaguePoints = soloQueue.leaguePoints
          summonerStats.hotStreak = soloQueue.hotStreak
          res.json(summonerStats)
        })
        .catch(error => console.log(error.statusCode))
    })
    .catch(error => { console.log(error.statusCode) })
})

/*
  Endpoint about a summoner's current champion
*/

app.get("/current-champion/:summonerName", (req, res) => {

})


app.listen(port, () => {
  console.log("running at http://localhost:" + port)
})