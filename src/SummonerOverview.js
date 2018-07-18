import React, { Component } from 'react'
import rp from 'request-promise' 

class SummonerOverview extends Component {
  state = {
    test: this.props.name,
    participants: this.props.participants
  }

  async componentDidMount() {
    // await this.getBadges("na", "Shiphtur", "Talon")
    //   .then(res => {
    //     console.log(res);
    //   })
  }

  async getBadges(region, summonerName, championName) {
    return await rp({
      uri: `http://localhost:12344/badges/${region}/${summonerName}/${championName}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
      },
      json: true
    });
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
        test: this.props.name,
        participants: this.props.participants
      })
    }
  }

  render() {
    return (
      <div>
        {this.state.test}
      </div>
    )
  }
}

export default SummonerOverview