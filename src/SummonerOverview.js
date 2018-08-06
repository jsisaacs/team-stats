import React, { Component } from 'react';
import styled from 'styled-components';
import Teammate from './Teammate';
import rp from 'request-promise';
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
`;

const ContainerTwo = styled.div`
  max-width: 350px;
  float: right;
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

  async getSummonerInfo(region, summonerName) {
    return await rp({
      uri: `http://localhost:12344/summoner-info/${region}/${summonerName}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
      },
      json: true
    });
  }

  async getChampionStatistics(region, summonerName, championName) {
    return await rp({
      uri: `http://localhost:12344/champion-statistics/${region}/${summonerName}/${championName}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
      },
      json: true
    });
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

    //if the state is expanded, and also if wins is equal to null,
    //then call getChampionStatistics() and set the appropriate teammate's state
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
      </div>
    )
  }
}

export default SummonerOverview