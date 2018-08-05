import React, { Component } from 'react';
import Teammate from './Teammate';
import rp from 'request-promise';
import ExpandedTeammate from './ExpandedTeammate';

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
  }

  getColor(teamCode) {
    if (teamCode === 100) {
      return "salmon";
    } else {
      return "cornflowerblue";
    }
  }

  getSide(teamCode) {
    if (teamCode === 100) {
      return "left";
    } else {
      return "right";
    }
  }

  render() {
    return (
      <div>
        <div>
          <h1>Team 1</h1>
          {this.state.participants.team1.map(teammate => {
            const expanded = teammate.expanded;
            if (!expanded) {
              return <Teammate
                      changeExpansion={input => this.changeExpansion(input)} 
                      key={teammate.summonerId}
                      team={this.getColor(teammate.team)}
                      side={this.getSide(teammate.team)}
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
        </div>
        <div>
          <h1>Team 2</h1>
          {this.state.participants.team2.map(teammate => {
            const expanded = teammate.expanded;
            if (!expanded) {
              return <Teammate
                      key={teammate.summonerId}
                      changeExpansion={input => this.changeExpansion(input)} 
                      team={this.getColor(teammate.team)}
                      side={this.getSide(teammate.team)}
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
        </div>
      </div>
    )
  }
}

export default SummonerOverview