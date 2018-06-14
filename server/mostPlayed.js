const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const cheerio = require("cheerio");
/*
  Returns a JSON object of the 10 most played champions and their game statistics, scraped from OP.GG via an AJAX request.
 */

router.get("/mostPlayed/:id", (req, res) => {
  const summonerStats = [];
  const opggChampionStats = summonerId =>
    (opGGRequestOptions = {
      uri: `http://na.op.gg/summoner/champions/ajax/champions.rank/summonerId=${summonerId}&season=11&queueType=soloranked`,
      transform: body => {
        return cheerio.load(body);
      }
    });
  rp(opggChampionStats(req.params.id))
    .then($ => {
      const tableData = $('.Body').html();
      $('tr').each(function (i, elem) {
        if (i > 10) {
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

});

module.exports = router;
