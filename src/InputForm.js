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
    let splitText = text.replace(/ joined the lobby/g, '').split('\n')
    console.log(splitText)

    //add all summoners to the team
    this.setState({ team: [] })
    for (let i = 0; i < splitText.length; i++) {
      fetch(`http://localhost:12344/summoner-stats/${splitText[i]}`)
        .then(res => res.json())
        .then(data => {
          let team = [...this.state.team]
          team.push(data)
          this.setState({ team })
        })
    }
  };

  checkLiveGame = event => {

  }

  render() {
    return (
      <div>

        <form onSubmit={this.handleSubmit}>
          <label>
            Summoners:
            <textarea
              rows='5'
              cols='40'
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <ul>
          {this.state.team.map(user => (
            <div>
              <li key={user.id}>{`Name: ${user.name}`}</li>
              <button onClick={this.checkLiveGame}>Live game</button>
            </div>
          ))}
        </ul>

      </div>
    );
  }
}

export default InputForm;
