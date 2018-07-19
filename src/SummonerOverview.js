import React, { Component } from 'react'
//import rp from 'request-promise' 

class SummonerOverview extends Component {
  state = {
    name: this.props.name,
    region: this.props.region,
    participants: {
      team1: this.props.participants.team1,
      team2: this.props.participants.team2
    }
  }

  async componentDidMount() {
    // await this.getBadges("na", "Shiphtur", "Talon")
    //   .then(res => {
    //     console.log(res);
    //   })
    console.log(this.state);
  }

  async getBadges(region, summonerName, championName) {
    // return await rp({
    //   uri: `http://localhost:12344/badges/${region}/${summonerName}/${championName}`,
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    //   },
    //   json: true
    // });
  }

  async getChampionStatistics(region, summonerName, championName) {
    //TODO
  }
  
  async getSummonerInfo(region, summonerName) {
    //TODO
  }

  async getChampionHistory(championName) {
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

  render() {
    return (
      <div>
        {this.state.name}
      </div>
    )
  }
}

export default SummonerOverview