import React, { Component } from 'react'

class SummonerOverview extends Component {
  state = {
    test: this.props.name
  }
  
  // componentDidMount() {
    
  // }

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      this.setState({test: this.props.name})
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