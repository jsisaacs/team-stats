import React, { Component } from 'react'
import rp from 'request-promise' 

class Form extends Component {
  constructor(props) {
    super(props);
    
    this.state = ({
      formSummonerNameInput: '',
      formRegionInput: 'na',
      gameStatus: false,
    });

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateGameStatus = this.validateGameStatus.bind(this);
  }

  handleTextChange(event) {
    this.setState({
      formSummonerNameInput: event.target.value
    });
  }

  handleRegionChange(event) {
    this.setState({
      formRegionInput: event.target.value
    });
  }

  handleSubmit(event) {
    this.validateGameStatus(this.state.formRegionInput, this.state.formSummonerNameInput);
    event.preventDefault();
  }

  validateGameStatus(region, summonerName) {
    const currentMatch = async () => {
      try {
        const match = await rp({
          uri: `http://localhost:12344/current-match/${region}/${summonerName}`,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
          },
          json: true
        });
        
        if (match.participants !== undefined) {
          this.setState({
            gameStatus: true
          });
        }

        if (match === 404) {
          this.setState({
            gameStatus: false
          })
        }
        
        console.log(this.state);

      } catch (error) {
        alert("failure");
      }
    }
    currentMatch();
  }
  
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Summoner Name:
          <input 
            type="text"
            value={this.state.formSummonerNameInput}
            onChange={this.handleTextChange}
            required
          />
        </label>
        <label>
          Region:
          <select 
            value={this.state.formRegionInput}
            onChange={this.handleRegionChange}
            required
          >
            <option value="na">North America</option>
            <option value="eune">Europe</option>
            <option value="kr">Korea</option>
            <option value="euw">Europe West</option>
            <option value="br">Brazil</option>
            <option value="lan">Latin America North</option>
            <option value="las">Latin America South</option> 
            <option value="oce">Oceania</option>
            <option value="ru">Russia</option>
            <option value="tr">Turkey</option>
            <option value="jp">Japan</option>
          </select>
        </label>
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default Form
