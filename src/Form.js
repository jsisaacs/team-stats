import React, { Component } from 'react'
import rp from 'request-promise' 

class Form extends Component {
  constructor(props) {
    super(props);
    
    this.state = ({
      summonerNameInput: ''
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateSummonerName = this.validateSummonerName.bind(this);
  }

  handleChange(event) {
    this.setState({
      summonerNameInput: event.target.value
    });
  }

  handleSubmit(event) {
    //alert('SUBMITTED:' + this.state.summonerNameInput);
    alert(this.state.summonerNameInput)
    this.validateSummonerName('na', this.state.summonerNameInput);
    event.preventDefault();
  }

  validateSummonerName(region, summonerName) {
    const summonerInfo = async () => {
      try {
        const info = await rp({
          uri: `http://localhost:12344/summoner-info/${region}/${summonerName}`,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
          },
          json: true
        });

        alert(info);
      } catch (error) {
        alert("ERROR")
      }
    }
    summonerInfo();
    
    // rp({
    //   uri: `http://localhost:12344/summoner-info/${region}/${summonerName}`,
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    //   },
    //   json: true
    // })
    //   .then(response => {
    //     alert("SUCCESS");
    //   })
    //   .error(error => {
    //     alert("ERROR")
    //   })

    
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Summoner Username:
          <input 
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default Form
