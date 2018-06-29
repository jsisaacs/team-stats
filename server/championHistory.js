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

router.get("/championGG-scrape/:championName", (req, res) => {
  const scrape = async () => {
    try {
      //TODO
    } catch (error) {
      //TODO
    }
  }
  scrape();
});

module.exports = router;