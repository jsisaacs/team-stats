import React, { Component } from 'react';
import rp from 'request-promise';
import styled from 'styled-components'; 

const FormWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: lightblue;
  height: 300px;
  align-items: center;
`;

const CompanyName = styled.h1`
  font-family: 'Rubik', sans-serif;
  letter-spacing: .06rem;
  color: rgb(57, 59, 67);
`;

const StyledForm = styled.form``;

const ServerDropdown = styled.select`
  height: 60px;
  outline: none;
  border-style: none;
  border-radius: 4px;
  margin-left: 5px;
  margin-right: 5px;
  font-family: 'Rubik', sans-serif;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: .05rem;
  background: white;
  //color: rgb(57, 59, 67);
  color: rgb(117, 117, 117);
`;

const SummonerInput = styled.input`
  padding: 12px 20px;
  margin-left: 5px;
  margin-right: 5px;
  box-sizing: border-box;
  border-style: solid;
  border-radius: 4px;
  border-width: 2px;
  border-color: rgba(255,255,255,0);
  height: 60px;
  width: 325px;
  outline: none; 
  font-family: 'Rubik', sans-serif;
  font-size: 16px;
  color: rgb(57, 59, 67);

  -webkit-transition: 0.25s;
  transition: 0.25s;

  &:focus {
    border: 2px solid rgb(57, 59, 67);
  }
`;

const SubmitButton = styled.input`
  background: rgb(57, 59, 67);
  border-style: none;
  border-radius: 4px; 
  width: 210px;
  height: 60px;
  outline: none;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  font-size: 18px;
  letter-spacing: .05rem;
  color: white;
  margin-left: 5px;
  margin-right: 5px;

  -webkit-transition-duration: 0.25s;
  transition-duration: 0.25s;

  &:hover {
    background: rgb(32, 35, 38);
  }
`;

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
      <div>
        <CompanyName>Prelytics</CompanyName>
        <FormWrapper>
          <StyledForm onSubmit={this.handleSubmit}>
              <ServerDropdown 
                value={this.state.formRegionInput}
                onChange={this.handleRegionChange}
                required
              >
                <option value="na">NA</option>
                <option value="eune">EUNE</option>
                <option value="kr">KR</option>
                <option value="euw">EUW</option>
                <option value="br">BR</option>
                <option value="lan">LAN</option>
                <option value="las">LAS</option> 
                <option value="oce">OCE</option>
                <option value="ru">RU</option>
                <option value="tr">TR</option>
                <option value="jp">JP</option>
              </ServerDropdown>
              <SummonerInput 
                type="text"
                placeholder="Provide a summoner name"
                value={this.state.formSummonerNameInput}
                onChange={this.handleTextChange}
                required
              />
            <SubmitButton type="submit" value="Get Current Match" />
          </StyledForm>
        </FormWrapper>
      </div>
    )
  }
}

export default Form
