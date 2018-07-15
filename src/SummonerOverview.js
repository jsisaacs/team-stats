import React, { Component } from 'react'

class SummonerOverview extends Component {
  componentDidMount() {
    console.log(this.props.name)
  }
  
  render() {
    return (
      <div>
        {this.props.name}
      </div>
    )
  }
}

export default SummonerOverview