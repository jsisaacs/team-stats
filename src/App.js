import React, { Component } from 'react'
import './App.css'
import Form from './Form'
import SummonerOverview from './SummonerOverview'
import SummonerError from './SummonerError'

class App extends Component {
  state = {
    form: {},
    loaded: false
  }
  
  formSubmit = (form) => {
    this.setState({ form });
  }
  
  render() {
    const inGame = this.state.form.gameStatus;
    
    return (
      <div>
        <Form formSubmit={form => this.formSubmit(form)} />
        {
        
          inGame 
            ? <SummonerOverview name={this.state.form.formSummonerNameInput} />
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
