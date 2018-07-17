import React, { Component } from 'react'

class SummonerOverview extends Component {
  componentDidMount() {
    //do data fetching here
    console.log(this.props.name);
    console.log(this.props.region)
  }

  render() {
    return (
      <div>
        {this.props.name}
        {this.props.region}
      </div>
    )
  }
}

export default SummonerOverview