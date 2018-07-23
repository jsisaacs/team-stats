import React, { Component } from 'react'
import Form from './Form'
import SummonerOverview from './SummonerOverview'
import SummonerError from './SummonerError'

class App extends Component {
  state = {
    form: {
      formSummonerNameInput: '',
      formRegionInput: 'na',
      gameStatus: false,
      participants: {
        team1: [],
        team2: []
      }
    },
  }
  
  formSubmit = (input) => {
    if (input.gameStatus === true) {
      this.setState({
        form: {
          formSummonerNameInput: input.formSummonerNameInput,
          formRegionInput: input.formRegionInput,
        },
        gameStatus: input.gameStatus,
        participants: {
          team1: input.participants.team1,
          team2: input.participants.team2
        }
      });
    } else {
      this.setState({
        form: {
          formSummonerNameInput: input.formSummonerNameInput,
          formRegionInput: input.formRegionInput,
        },
        gameStatus: input.gameStatus,
        participants: {
          team1: [],
          team2: []
        }
      });
    }
    console.log(this.state);
  }
  
  render() {
    const inGame = this.state.gameStatus;
    
    return (
      <div>
        <Form formSubmit={form => this.formSubmit(form)} />
        {
          inGame 
            ? <SummonerOverview 
                name={this.state.form.formSummonerNameInput}
                region={this.state.form.formRegionInput}
                participants={this.state.participants}
              />
            : <SummonerError />
        }
      </div>
    )
  }
}

export default App
