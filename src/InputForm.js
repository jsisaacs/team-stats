import React from "react";
import "./InputForm.css";

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
      value: event.target.value
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const text = this.state.value;
    let splitText = text.replace(/ joined the lobby/g, "").split("\n");
    //add all summoners to the team
    this.setState({ team: [] });
    for (let i = 0; i < splitText.length; i++) {
      fetch(`http://localhost:12344/summoner-stats/${splitText[i]}`)
        .then(res => res.json())
        .then(data => {
          if (data.id !== -1) {
            fetch(`http://localhost:12344/mostPlayed/${data.id}`).then(res => res.json()).then(mostPlayed => {
              data.mostPlayed = mostPlayed
              let team = [...this.state.team];
              team.push(data);
              this.setState({ team });
            })
          }
        });
    }
  };

  checkLiveGame = event => { };

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Summoners:
            <textarea
              rows="5"
              cols="40"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <ul>
          {this.state.team.map(user => (
            <div key={user.id}>
              <li>{`Name: ${user.name}`}</li>
              <li>{`Rank: ${user.tier} ${user.rank}`}</li>
              <li>Most played champion:</li>
              {user.mostPlayed.map(d => {
                return <img key={d.championName} src={`http://opgg-static.akamaized.net/images/lol/champion/${d.championName.replace(/ |'/g, '')}.png?image=w_50`} alt={d.championName} />
              })}
              <br />
              <button onClick={this.checkLiveGame}>Live game</button>
            </div>
          ))}
        </ul>›
      </div>
    );
  }
}

export default InputForm;
