import React, { Component } from 'react'
import rp from 'request-promise' 

class Form extends Component {
  constructor(props) {
    super(props);
    
    this.state = ({
      formInput: '',
      gameStatus: false,
    });

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateGameStatus = this.validateGameStatus.bind(this);
  }

  handleChange(event) {
    this.setState({
      formInput: event.target.value
    });
  }

  handleSubmit(event) {
    this.validateGameStatus('na', this.state.formInput);
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
