import React, { Component } from 'react';
import Form from './Form';
import SummonerOverview from './SummonerOverview';
import SummonerError from './SummonerError';
import styled from 'styled-components';
import MediaQuery from 'react-responsive';

const Wrapper = styled.div`
  // margin: 0 auto;
  // max-width: 75em;
  // background: rgb(243, 243, 247);
`;

class App extends Component {
  state = {
    form: {
      formSummonerNameInput: '',
      formRegionInput: 'na',
      gameStatus: false,
      participants: {
        team1: [],
        team2: []
      }
    },
    initialLoading: true
  }
  
  formSubmit = (input) => {
    if (input.gameStatus === true) {
      this.setState({
        form: {
          formSummonerNameInput: input.formSummonerNameInput,
          formRegionInput: input.formRegionInput,
        },
        gameStatus: input.gameStatus,
        participants: {
          team1: input.participants.team1,
          team2: input.participants.team2
        }
      });
    } else {
      this.setState({
        form: {
          formSummonerNameInput: input.formSummonerNameInput,
          formRegionInput: input.formRegionInput,
        },
        gameStatus: input.gameStatus,
        participants: {
          team1: [],
          team2: []
        },
        initialLoading: false
      });
    }
  }
  
  render() {
    const inGame = this.state.gameStatus;
    const initialLoading = this.state.initialLoading;

    return (
      <Wrapper>
        <MediaQuery minWidth={745}>
          <Form formSubmit={form => this.formSubmit(form)} />
          {
            inGame 
              ? <SummonerOverview 
                  name={this.state.form.formSummonerNameInput}
                  region={this.state.form.formRegionInput}
                  participants={this.state.participants}
                />
              : (initialLoading
                  ? null
                  : <SummonerError 
                      name={this.state.form.formSummonerNameInput}
                    />
              )
          }
        </MediaQuery>
        <MediaQuery maxWidth={744}>
          <div>You are a tablet or mobile phone</div>
        </MediaQuery>
      </Wrapper>
    )
  }
}

export default App
