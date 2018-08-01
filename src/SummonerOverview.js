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

  render() {
    return (
      <div>
        <h1>Team 1</h1>
        {this.state.participants.team1.map(teammate => {
          const expanded = teammate.expanded;
          if (expanded) {
            console.log("EXPANDED")
          } else {
            console.log("NOT EXPANDED")
          }
          // expanded 
          //   ?  <ExpandedTeammate />
          //   : <Teammate 
          //       key={teammate.summonerId}
          //       summonerName={teammate.summonerName}
          //       championName={teammate.championName}
          //     />
          return <Teammate 
                  key={teammate.summonerId}
                  summonerName={teammate.summonerName}
                  championName={teammate.championName}
                 />
        })}
        <h1>Team 2</h1>
        {this.state.participants.team2.map(teammate => {
          return <Teammate 
                  key={teammate.summonerId}
                  summonerName={teammate.summonerName}
                  championName={teammate.championName}
                 />
        })}
      </div>
    )
  }
}

export default SummonerOverview