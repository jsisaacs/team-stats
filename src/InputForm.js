import React from 'react'
import './InputForm.css'

class InputForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            team: []
        }
    }

    isValidSummonerName = (name) => {
        //TODO
    }
  
    handleChange = (event) => {
        this.setState({
            value: event.target.value,
            team: []
        })
    }
  
    handleSubmit = (event) => {
        const text = this.state.value
        let team = this.state.team
        let textArray = text.split(',')

        //remove whitespace
        textArray = textArray.map(item => item = item.replace(/\s+/g, ''))
        
        //check if each username is valid
        //TODO
        
        textArray.map(item =>
            team.push({
                username: item
            })
        )

        console.log(team)
        event.preventDefault()
    }
  
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <label>
                    Summoners:
                    <input type="text" value={this.state.value} onChange={this.handleChange} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
  
export default InputForm