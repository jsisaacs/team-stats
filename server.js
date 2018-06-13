require('dotenv').config()  // configure dotenv
const express = require("express")
const rp = require('request-promise')
const cors = require("cors")
const _kayn = require('kayn')
const Kayn = _kayn.Kayn
const REGIONS = _kayn.REGIONS
const cheerio = require('cheerio')
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
  Returns a JSON object of the 20 most played champions and their game statistics, scraped from OP.GG via an AJAX request.
 */

app.get("/test/:summonerName", (req, res) => {
  const summonerStats = [];
  
  const summonerStatsRequest = (summonerName) => (
    summonerStatsRequestOptions = {
      uri: `http://localhost:12344/summoner-stats/${summonerName}`,
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    }
  );
  
  const opggChampionStats = (summonerId) => (
    opGGRequestOptions = {
      uri: `http://na.op.gg/summoner/champions/ajax/champions.rank/summonerId=${summonerId}&season=11&queueType=soloranked`,
      transform: body => {
        return cheerio.load(body);
      }
    }
  );

  rp(summonerStatsRequest(req.params.summonerName))
    .then(response => {
      rp(opggChampionStats(response.id))
        .then($ => {
          const tableData = $('.Body').html();
          $('tr').each(function(i, elem) {
            if (i > 20) {
              return false;
            } else {
              const championData = {
                championRank: i + 1,
                championName: $('tr').not($('tr')[0]).eq(i).children().eq(1).children().first().children().text(),
                championImage: undefined,
                wins: Number($('tr').not($('tr')[0]).eq(i).children().eq(3).children().first().children().first().children().eq(1).text().slice(0, -1).replace(/,/g, '')),
                losses: Number($('tr').not($('tr')[0]).eq(i).children().eq(3).children().first().children().first().children().eq(3).text().slice(0, -1).replace(/,/g, '')),
                kda: {
                  kills: Number($('tr').not($('tr')[0]).eq(i).children().eq(4).children().first().children().first().text()),
                  deaths: Number($('tr').not($('tr')[0]).eq(i).children().eq(4).children().first().children().eq(1).text()),
                  assists: Number($('tr').not($('tr')[0]).eq(i).children().eq(4).children().first().children().eq(2).text())
                },
                gold: Number($('tr').not($('tr')[0]).eq(i).children().eq(5).text().slice(6, -5).replace(/,/g, '')),
                cs: Number($('tr').not($('tr')[0]).eq(i).children().eq(6).text().slice(6, -5).replace(/,/g, '')),
                maxKills: Number($('tr').not($('tr')[0]).eq(i).children().eq(7).text().slice(7, -6).replace(/,/g, '')),
                maxDeaths: Number($('tr').not($('tr')[0]).eq(i).children().eq(8).text().slice(7, -6).replace(/,/g, '')),
                averageDamageDealt: Number($('tr').not($('tr')[0]).eq(i).children().eq(9).text().slice(7, -6).replace(/,/g, '')),
                averageDamageTaken: Number($('tr').not($('tr')[0]).eq(i).children().eq(10).text().slice(7, -6).replace(/,/g, '')),
                doubleKill: Number($('tr').not($('tr')[0]).eq(i).children().eq(11).text().slice(14, -12).replace(/,/g, '')),
                tripleKill: Number($('tr').not($('tr')[0]).eq(i).children().eq(12).text().slice(14, -12).replace(/,/g, '')),
                quadraKill: Number($('tr').not($('tr')[0]).eq(i).children().eq(13).text().slice(14, -12).replace(/,/g, '')),
                pentaKill: Number($('tr').not($('tr')[0]).eq(i).children().eq(14).text().slice(14, -12).replace(/,/g, ''))
              }
              summonerStats.push(championData);
          }
          });
          summonerStats.pop();
          res.json(summonerStats);
        })
        .catch(error => {
          console.log(`${error.statusCode}: Error accessing OP.GG data.`)
        });
    })
    .catch(error => {
      console.log(`${error.statusCode}: Error accessing summoner info.`)
    });
});

/*
  Endpoint aggregating match data for a given summoner name and champion id.
*/

app.get("/match-aggregations/:summonerName/:championId", (req, res) => {
  matchAggregations = {
    winRate: -1,
  }

  function getTeam(champId, match) {
    match.participants.map(participant => {
      if (participant.championId === champId) {
        return participant.teamId;
      }
    })
  }

  function getWinRate(matchData) {
    let wins = 0;
    let losses = 0;
    matchData.map(match => {
      const team = getTeam(req.params.championId, match);
      console.log(team);
    })
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
            matchDataRequests.push(
              kayn.Match
              .get(match.gameId)
            )
          })
             
          Promise.all(matchDataRequests)
            .then(matchData => {
              //matchAggregations.winRate = getWinRate(matchData);
              res.json("WOW");
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