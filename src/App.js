import React, { Component } from 'react'
import './App.css'
import Form from './Form' 

class App extends Component {
  state = {
    form: {}
  }
  
  formSubmit = (form) => {
    this.setState({ form });
  }
  
  render() {
    return (
      <div>
        <Form formSubmit={form => this.formSubmit(form)} />
      </div>
    )
  }
}

export default App
