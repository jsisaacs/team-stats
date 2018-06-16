const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const cheerio = require("cheerio");
const champions = require("lol-champions");

function getChampionId(championName) {
  const getChampion = champions.filter(champion => {
    return champion.name === championName;
  });
  return getChampion[0].key;
}

/*
  Return champion statistics for a specific summoner and champion.
*/

router.get("/champion-statistics/:summonerName/:championName", (req, res) => {
  const summonerStats = [];

  const summonerInfoRequest = summonerName =>
    (summonerInfoRequestOptions = {
      uri: `http://localhost:12344/summoner-info/${summonerName}`,
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    });

  const opggChampionStats = summonerId =>
    (opGGRequestOptions = {
      uri: `http://na.op.gg/summoner/champions/ajax/champions.rank/summonerId=${summonerId}&season=11&queueType=soloranked`,
      transform: body => {
        return cheerio.load(body);
      }
    });

  rp(summonerInfoRequest(req.params.summonerName))
    .then(response => {
      rp(opggChampionStats(response.id))
      .then($ => {
        const tableData = $('.Body').html();

        $('tr').each(function (i, elem) {
            const champName = $('tr').not($('tr')[0]).eq(i).children().eq(1).children().first().children().text();

            //data scraped from OP.GG 
            const championData = {
              championRank: i + 1,
              championName: champName,
              championId: undefined,
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
        });
        summonerStats.pop();
        const filteredOutput = summonerStats.filter(summonerStat => {
          return summonerStat.championName === req.params.championName;
        });
        filteredOutput[0].championId = getChampionId(filteredOutput[0].championName);
        res.json(filteredOutput);
      })
      .catch(error => {
        res.json(error.statusCode);
        console.log(`${error.statusCode}: Error accessing OP.GG data.`);
      });
    })
    .catch(error => {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing summoner-info data.`);
    });
});

/*
  Returns a JSON object of the 10 most played champions and their game statistics, scraped from OP.GG via an AJAX request.
 */

router.get("/champion-statistics/:summonerName/", (req, res) => {
  const summonerStats = [];

  const summonerInfoRequest = summonerName =>
    (summonerInfoRequestOptions = {
      uri: `http://localhost:12344/summoner-info/${summonerName}`,
      headers: {
        "User-Agent": "Request-Promise"
      },
      json: true
    });

  const opggChampionStats = summonerId =>
    (opGGRequestOptions = {
      uri: `http://na.op.gg/summoner/champions/ajax/champions.rank/summonerId=${summonerId}&season=11&queueType=soloranked`,
      transform: body => {
        return cheerio.load(body);
      }
    });

  rp(summonerInfoRequest(req.params.summonerName))
    .then(response => {
      rp(opggChampionStats(response.id))
      .then($ => {
        const tableData = $('.Body').html();

        $('tr').each(function (i, elem) {
          if (i > 10) {
            return false;
          } else {

            //data scraped from OP.GG 
            const championData = {
              championRank: i + 1,
              championName: $('tr').not($('tr')[0]).eq(i).children().eq(1).children().first().children().text(),
              championId: undefined,
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

        summonerStats.map(champion => {
          champion.championId = getChampionId(champion.championName);
        });

        res.json(summonerStats);
      })
      .catch(error => {
        res.json(error.statusCode);
        console.log(`${error.statusCode}: Error accessing OP.GG data.`);
      });
    })
    .catch(error => {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing summoner-info data.`);
    });
});

module.exports = router;
