import React, { Component } from 'react'
import './App.css'
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
    }
  }
  
  formSubmit = (form) => {
    this.setState({
       form
    });
    console.log(this.state);
  }
  
  render() {
    const inGame = this.state.form.gameStatus;
    
    return (
      <div>
        <Form formSubmit={form => this.formSubmit(form)} />
        {
          inGame 
            ? <SummonerOverview 
                name={this.state.form.formSummonerNameInput}
                region={this.state.form.formRegionInput}
                participants={this.state.form.participants}
              />
            : <SummonerError />
        }
        <p>
          {JSON.stringify(this.state, null, 2)}
        </p>
      </div>
    )
  }
}

export default App
