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

  handleChange = event => {
    this.setState({
      value: event.target.value,
      team: []
    });
  };


  handleSubmit = event => {
    event.preventDefault();
    const text = this.state.value;
    let splitText = text.split(' joined the lobby');
    splitText.pop();

    // const team = [... this.state.team];
    // splitText.map(summoner => {
    //   if (this.isValidSummonerName() === true) {
    //     team.push(da)
    //   }
    // });

    //add all summoners to the team
    for (let i = 0; i < splitText.length; i++) {
      fetch(`http://localhost:12344/summoner/${splitText[i]}`)
        .then(res => res.json())
        .then(data => {
          const team = [...this.state.team];
          if (data === undefined) {
            console.log("Doesnt exist")
          }
          team.push(data);
          this.setState({
            team
          });
          console.log(team)
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
