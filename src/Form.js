import React, { Component } from 'react';
import rp from 'request-promise';
import styled from 'styled-components'; 

const StyledForm = styled.form``;
const SummonerLabel = styled.label``;
const SummonerInput = styled.input``;
const RegionLabel = styled.label``;
const SubmitButton = styled.input``;

class Form extends Component {
  constructor(props) {
    super(props);
    
    this.state = ({
      formSummonerNameInput: '',
      formRegionInput: 'na',
      gameStatus: false,
    }); 

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleRegionChange = this.handleRegionChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.loadGame = this.loadGame.bind(this);
  }

  handleTextChange(event) {
    this.setState({
      formSummonerNameInput: event.target.value
    });
  }

  handleRegionChange(event) {
    this.setState({
      formRegionInput: event.target.value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();

    const region = this.state.formRegionInput;
    const summonerName = this.state.formSummonerNameInput;
    
    const game = await this.loadGame(region, summonerName);

    if (game.participants !== undefined) {
      this.setState({
        gameStatus: true,
        participants: game.participants
      })
    } else {
      this.setState({
        gameStatus: false,
        participants: null
      })
    }  
    this.props.formSubmit(this.state);
    
    this.setState({
      formSummonerNameInput: '',
      formRegionInput: 'na',
      gameStatus: false
    });
  }

  async loadGame(region, summonerName) {
    return await rp({
      uri: `http://localhost:12344/current-match/${region}/${summonerName}`,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
      },
      json: true
    });
  }
  
  render() {
    return (
      <StyledForm onSubmit={this.handleSubmit}>
        <SummonerLabel>
          Summoner Name:
          <SummonerInput 
            type="text"
            value={this.state.formSummonerNameInput}
            onChange={this.handleTextChange}
            required
          />
        </SummonerLabel>
        <RegionLabel>
          Region:
          <select 
            value={this.state.formRegionInput}
            onChange={this.handleRegionChange}
            required
          >
            <option value="na">North America</option>
            <option value="eune">Europe</option>
            <option value="kr">Korea</option>
            <option value="euw">Europe West</option>
            <option value="br">Brazil</option>
            <option value="lan">Latin America North</option>
            <option value="las">Latin America South</option> 
            <option value="oce">Oceania</option>
            <option value="ru">Russia</option>
            <option value="tr">Turkey</option>
            <option value="jp">Japan</option>
          </select>
        </RegionLabel>
        <SubmitButton type="submit" value="Submit" />
      </StyledForm>
    )
  }
}

export default Form
