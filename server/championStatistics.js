const express = require("express");
const router = express.Router();
const { Kayn } = require('kayn');
const rp = require("request-promise");
const cheerio = require("cheerio");
const champions = require("lol-champions");

const kayn = Kayn(process.env.RIOT_LOL_API_KEY)({
  debugOptions: {
    isEnabled: false,
    showKey: false,
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
  },
});

const opggChampionStats = (region, summonerId) =>
  (opGGRequestOptions = {
    uri: `http://${region}.op.gg/summoner/champions/ajax/champions.rank/summonerId=${summonerId}&season=11&queueType=soloranked`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    },
    transform: body => {
      return cheerio.load(body);
    }
  });

const opggKR = summonerId =>
  (opGGKRRequestOptions = {
    uri: `http://www.op.gg/summoner/champions/ajax/champions.rank/summonerId=${summonerId}&season=11&queueType=soloranked`,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    },
    transform: body => {
      return cheerio.load(body);
    }
  });

const getChampionId = championName => {
  const getChampion = champions.filter(champion => {
    return champion.name === championName;
  });
  return getChampion[0].key;
}

/*
  Return champion statistics for a specific summoner and champion.
*/

router.get("/champion-statistics/:region/:summonerName/:championName", (req, res) => {
  const championStatistics = async () => {
    try {
      const summonerStats = [];
      
      const { id } = await kayn.Summoner.by.name(req.params.summonerName).region(req.params.region);
      
      const leaguePosition = await kayn.LeaguePositions.by.summonerID(String(id)).region(req.params.region);

      const champId = getChampionId(req.params.championName);
      const { championLevel } = await kayn.ChampionMastery.get(id)(champId).region(req.params.region);
    
      scrape = promise => {
        Promise.resolve(promise).then($ => {
          $('tr').each(function (i, elem) {
            const champName = $('tr').not($('tr')[0]).eq(i).children().eq(1).children().first().children().text();
            const championData = {
              championRank: i + 1,
              championName: champName,
              championId: undefined,
              championImage: undefined,
              championMastery: championLevel,
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
        
        const response = filteredOutput[0];
        
        response.badges = {
          hotStreak: false,
          mastery6: false,
          mastery7: false,
          newbie: false,
          fiftyGames: false,
          veteran: false,
          sixtyPlusWinrate: false,
          highDamage: false,
          goldMachine: false,
          safePlayer: false,
          terrible: false,
          strongKDA: false,
          excellentKDA: false,
          inPromos: false
        }
        response.championRating = 85;

        //rotate through leaguePosition and get ranked solo
        let leagueIndex = 0;
        for (let i = 0; i < leaguePosition.length; i++) {
          if (leaguePosition[i].queueType === 'RANKED_SOLO_5x5') {
            leagueIndex = i;
          }
        }

        const { leaguePoints, hotStreak, tier, rank } = leaguePosition[leagueIndex];

        //MASTERY: TODO
        const gameNumber = response.wins + response.losses;
        const winRate = Number(Number((response.wins / gameNumber) * 100).toFixed(2));
        const gold = response.gold;
        const damage = response.averageDamageDealt;
        const damageTaken = response.averageDamageTaken;
        const killsBadgeData = response.kda.kills;
        const deathsBadgeData = response.kda.deaths;
        const assistsBadgeData = response.kda.assists;
        const kdaRatio = (killsBadgeData + assistsBadgeData) / deathsBadgeData;

        response.badges.hotStreak = hotStreak;
        response.tier = tier;
        response.rank = rank;

        if (championLevel === 6) {
          response.badges.mastery6 = true;
        }

        if (championLevel === 7) {
          response.badges.mastery7 = true;
        }

        if (gameNumber <= 15) {
          response.badges.newbie = true;
        }

        if (gameNumber >= 50 && gameNumber < 100) {
          response.badges.fiftyGames = true;
        }

        if (gameNumber >= 100) {
          response.badges.veteran = true;
        }

        if (winRate >= 60) {
          response.badges.sixtyPlusWinrate = true;
        }

        if (winRate <= 42 && gameNumber >= 15) {
          response.badges.terrible = true;
        }

        if (kdaRatio >= 3 && kdaRatio < 4) {
          response.badges.strongKDA = true;
        }

        if (kdaRatio >= 4) {
          response.badges.excellentKDA = true;
        }

        if (gold > 10000) {
          response.badges.goldMachine = true;
        }

        if (damage >= 100000) {
          response.badges.highDamage = true;
        }

        if (damageTaken <= 14000) {
          response.badges.safePlayer = true;
        }

        if (leaguePoints === 100) {
          response.badges.inPromos = true;
        }

        res.json(response);
        console.log('200: Success accessing /champion-statistics.');
        })
        .catch(() => {
          res.json(404);
          console.log('404: Error accessing OP.GG data.');
        });
      }
    
      if (req.params.region === 'kr') {
        const opggKRData = await rp(opggKR(id));
        scrape(opggKRData);
      } else {
        const opggData = await rp(opggChampionStats(req.params.region, id));
        scrape(opggData);
      }
    } catch (error) {
      res.json(error.statusCode);
      console.log(`${error.statusCode}: Error accessing /champion-statistics.`);
    }
  }
  championStatistics();
});

module.exports = router;
