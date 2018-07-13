import React, { Component } from 'react'
import './App.css'
import Form from './Form' 

class App extends Component {
  state = {
    fields: {}
  }
  
  formSubmit = (fields) => {
    this.setState({ fields });
    console.log('App component got: ', fields);
  }
  
  render() {
    return (
      <div>
        <Form formSubmit={fields => this.formSubmit(fields)}/>
        <p>
          {JSON.stringify(this.state.fields, null, 2)}
        </p>
      </div>
    )
  }
}

export default App
