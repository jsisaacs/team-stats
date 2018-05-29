import React from "react";
import "./InputForm.css";
import { link } from "fs";

class InputForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      team: []
    };
  }

  isValidSummonerName = name => {
    //TODO
  };

  handleChange = event => {
    this.setState({
      value: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const text = this.state.value;
    let textArray = text.split(",");
    //remove whitespace
    textArray = textArray.map(item => (item = item.replace(/\s+/g, "")));

    //check if each username is valid
    //TODO
    for (let i = 0; i < textArray.length; i++) {
      fetch(`http://localhost:12344/summoner/${textArray[i]}`)
        .then(res => res.json())
        .then(data => {
          const team = [...this.state.team];
          team.push(data);
          this.setState({
            team
          });
        });
    }
  };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Summoners:
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ul>
          {this.state.team.map(user => (
            <li>{`Name: ${user.name} and Level: ${user.summonerLevel}`}</li>
          ))}
        </ul>
      </div>
    );
  }
}

export default InputForm;
