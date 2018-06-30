const express = require("express");
const router = express.Router();
const rp = require("request-promise");
const cheerio = require("cheerio");

const championGGStats = () => 
  (championGGStatsOptions = {
    uri: 'http://api.champion.gg/stats',
    qs: {
      api_key: process.env.CHAMPION_GG_KEY
    },
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    },
    json: true
  });

const opggScrape = championName =>
  (opggScrapeOptions = {
    uri: `http://www.op.gg/champion/${championName}/statistics`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    },
    transform: body => {
      return cheerio.load(body);
    }
  });

router.get("/champion-history/", (req, res) => {
  const championHistory = async () => {
    try {
      const stats = await rp(championGGStats()); 
      res.json(stats);
      console.log('200: Success accessing /champion-history.');
    } catch (error) {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing /champion-history.`);
    }
  }
  championHistory();
});

router.get("/opgg-scrape/:championName", (req, res) => {
  const scrape = async () => {
    try {
      const scrape = await rp(opggScrape(req.params.championName));
      Promise.resolve(scrape).then($ => {
        const tableData = $('body');

        const array = [];
        const body = tableData.children().each(function (index, element) {
          array.push($(this));
        });
        const scripts = [];
        const thing = array[0].find('script').each(function (index, element) {
          scripts.push($(this).html());
        });
        const winRate = scripts[4];
        const pickRate = scripts[5];
        const gameLengthWinRate = scripts[6];

        console.log(winRate);
        console.log(pickRate);
        console.log(gameLengthWinRate);
        
      }).catch(error => {
        console.log("RORO")
      })
    } catch (error) {
      //TODO
    }
  }
  scrape();
});

module.exports = router;