import React, { Component } from 'react';
import styled from 'styled-components';
import rp from 'request-promise';
import MediaQuery from 'react-responsive';
import Teammate from './Teammate';
import ExpandedTeammate from './ExpandedTeammate';

const TeamName = styled.h1`
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  font-size: 45px;
  color: rgb(57, 59, 67);
  padding-left: 20px;
  padding-right: 20px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ContainerOne = styled.div`
  max-width: 350px;
  float: left;
  padding-left: 15px;
`;

const ContainerTwo = styled.div`
  max-width: 350px;
  float: right;
  padding-right: 15px;
`;

class SummonerOverview extends Component {
  state = {
    name: this.props.name,
    region: this.props.region,
    participants: {
      team1: this.props.participants.team1,
      team2: this.props.participants.team2
    }
  }

  componentDidMount() {
    console.log(this.state);
  }

  getChampionStatistics(region, summonerName, championName) {
    return rp({
      uri: `http://localhost:12344/champion-statistics/${region}/${summonerName}/${championName}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
      },
      json: true
    });
  }

  getChampionHistory() {
    //TODO
  }

  async componentDidUpdate(prevProps) {
    if (this.props !== prevProps) {
      this.setState({
        name: this.props.name,
        region: this.props.region,
        participants: {
          team1: this.props.participants.team1,
          team2: this.props.participants.team2
        }
      })
    }
  }

  async loadExpansionData(summonerName) {
    const team1 = this.state.participants.team1.slice(0);
    const team2 = this.state.participants.team2.slice(0);

    let team1Index = 0;
    for (const teammate of team1) {
      if (summonerName === teammate.summonerName && teammate.expanded === true) {
        if (teammate.championStatistics.cs === null) {
          const championStatistics = await this.getChampionStatistics(this.state.region, summonerName, teammate.championName);

          //copy this.state
          //loop thru team1 until you find teammate
          //set championStatistics fields to the new data
          //add the copied state to setState

          const stateCopy = JSON.parse(JSON.stringify(this.state));
          const statsCopy = stateCopy.participants.team1[team1Index];
          
          //Champion stats copying
          statsCopy.championStatistics.averageDamageDealt = championStatistics.averageDamageDealt;
          statsCopy.championStatistics.averageDamageTaken = championStatistics.averageDamageTaken;
          statsCopy.championStatistics.championId = championStatistics.championId;
          statsCopy.championStatistics.championName = championStatistics.championName;
          statsCopy.championStatistics.championRank = championStatistics.championRank;
          statsCopy.championStatistics.championRating = championStatistics.championRating;
          statsCopy.championStatistics.cs = championStatistics.cs;
          statsCopy.championStatistics.doubleKill = championStatistics.doubleKill;
          statsCopy.championStatistics.gold = championStatistics.gold;
          statsCopy.championStatistics.kda.assists = championStatistics.kda.assists;
          statsCopy.championStatistics.kda.deaths = championStatistics.kda.deaths;
          statsCopy.championStatistics.kda.kills = championStatistics.kda.kills;
          statsCopy.championStatistics.losses = championStatistics.losses;
          statsCopy.championStatistics.maxDeaths = championStatistics.maxDeaths;
          statsCopy.championStatistics.maxKills = championStatistics.maxKills;
          statsCopy.championStatistics.pentaKill = championStatistics.pentaKill;
          statsCopy.championStatistics.quadraKill = championStatistics.quadraKill;
          statsCopy.championStatistics.rank = championStatistics.rank;
          statsCopy.championStatistics.tier = championStatistics.tier;
          statsCopy.championStatistics.tripleKill = championStatistics.tripleKill;
          statsCopy.championStatistics.wins = championStatistics.wins;
          
          //Badges copying
          statsCopy.championStatistics.badges.excellentKDA = championStatistics.badges.excellentKDA;
          statsCopy.championStatistics.badges.fiftyGames = championStatistics.badges.fiftyGames;
          statsCopy.championStatistics.badges.goldMachine = championStatistics.badges.goldMachine;
          statsCopy.championStatistics.badges.highDamage = championStatistics.badges.highDamage;
          statsCopy.championStatistics.badges.hotStreak = championStatistics.badges.hotStreak;
          statsCopy.championStatistics.badges.inPromos = championStatistics.badges.inPromos;
          statsCopy.championStatistics.badges.mastery6 = championStatistics.badges.mastery6;
          statsCopy.championStatistics.badges.mastery7 = championStatistics.badges.mastery7;
          statsCopy.championStatistics.badges.newbie = championStatistics.badges.newbie;
          statsCopy.championStatistics.badges.safePlayer = championStatistics.badges.safePlayer;
          statsCopy.championStatistics.badges.sixtyPlusWinrate = championStatistics.badges.sixtyPlusWinrate;
          statsCopy.championStatistics.badges.strongKDA = championStatistics.badges.strongKDA;
          statsCopy.championStatistics.badges.terrible = championStatistics.badges.terrible;
          statsCopy.championStatistics.badges.veteran = championStatistics.badges.veteran;

          this.state = stateCopy;
        } else {
          console.log("ALREADY EXPANDED BEFORE")
        }
      }
      team1Index = team1Index + 1;
    }

    team2.forEach(teammate => {
      if (summonerName === teammate.summonerName && teammate.expanded === true) {
        
      }
    });

  }

  changeExpansion(summonerName) {
    const team1 = this.state.participants.team1.slice(0);
    const team2 = this.state.participants.team2.slice(0);

    team1.forEach(teammate => {
      if (summonerName === teammate.summonerName) {
        teammate.expanded = !teammate.expanded;
      }
    });

    team2.forEach(teammate => {
      if (summonerName === teammate.summonerName) {
        teammate.expanded = !teammate.expanded;
      }
    });

    this.setState({
      participants: {
        team1: team1,
        team2: team2
      }
    });

    this.loadExpansionData(summonerName);
  }

  getColor(teamCode) {
    if (teamCode === 100) {
      return "#f7d1d5";
    } else {
      return "#d1ddf7";
    }
  }

  getOutlineColor(teamCode) {
    if (teamCode === 100) {
      return "#fe828d"
    } else {
      return "#82a1fe";
    }
  }

  getFontColor(teamCode) {
    if (teamCode === 100) {
      return "#d8414f";
    } else {
      return "#4170d8";
    }
  }

  getSide(teamCode) {
    if (teamCode === 100) {
      return "left";
    } else {
      return "right";
    }
  }

  setTeamTitle(teamCode) {
    if (teamCode === 100) {
      return "Red";
    } else {
      return "Blue";
    }
  }

  render() {
    return (
      <div>
        <MediaQuery minWidth={745}>
          <ContainerOne>
            <TeamName>{`${this.setTeamTitle(this.state.participants.team1[0].team)} Team`}</TeamName>
            {this.state.participants.team1.map(teammate => {
              const expanded = teammate.expanded;
              if (!expanded) {
                return <Teammate
                        changeExpansion={input => this.changeExpansion(input)} 
                        key={teammate.summonerId}
                        team={this.getColor(teammate.team)}
                        side={this.getSide(teammate.team)}
                        fontColor={this.getFontColor(teammate.team)}
                        outlineColor={this.getOutlineColor(teammate.team)}
                        summonerName={teammate.summonerName}
                        championName={teammate.championName}
                      /> 
              } else {
                return <ExpandedTeammate 
                        key={teammate.summonerId}
                        changeExpansion={input => this.changeExpansion(input)}
                        summonerName={teammate.summonerName}
                        championName={teammate.championName}
                      />
              }
            })}
          </ContainerOne>
          <ContainerTwo>
            <TeamName>{`${this.setTeamTitle(this.state.participants.team2[0].team)} Team`}</TeamName>
            {this.state.participants.team2.map(teammate => {
              const expanded = teammate.expanded;
              if (!expanded) {
                return <Teammate
                        key={teammate.summonerId}
                        changeExpansion={input => this.changeExpansion(input)} 
                        team={this.getColor(teammate.team)}
                        side={this.getSide(teammate.team)}
                        fontColor={this.getFontColor(teammate.team)}
                        outlineColor={this.getOutlineColor(teammate.team)}
                        summonerName={teammate.summonerName}
                        championName={teammate.championName}
                      /> 
              } else {
                return <ExpandedTeammate 
                        key={teammate.summonerId}
                        changeExpansion={input => this.changeExpansion(input)}
                        summonerName={teammate.summonerName}
                        championName={teammate.championName}
                      />
              }
            })}
          </ContainerTwo>
        </MediaQuery>
        <MediaQuery maxWidth={744}>
          <div>You are a tablet or mobile phone</div>
        </MediaQuery>
      </div>
    )
  }
}

export default SummonerOverview