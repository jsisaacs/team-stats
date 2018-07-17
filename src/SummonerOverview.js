import React, { Component } from 'react'

class SummonerOverview extends Component {
  state = {
    test: this.props.name,
    participants: this.props.participants
  }

  async getBadges(region, summonerName) {
    //TODO
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

  componentDidMount() {
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