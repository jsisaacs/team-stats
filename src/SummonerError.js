import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 0 20px lightgrey;
  margin: auto;
  width: 50%;
  margin-top: 20px;
  margin-bottom: 20px;
  padding: 30px;
`;

const Header = styled.h1`
  font-family: 'Rubik', sans-serif;
  font-style: italic;
  font-size: 50px;
  color: rgb(57, 59, 67);
  margin-top: 0px;
`;

const HeaderAccent = styled.span`
  font-family: 'Rubik', sans-serif;
  font-style: italic;
  font-size: 50px;
  color: rgb(82, 231, 185);
`;

const SubHeader = styled.h3`
  font-family: 'Rubik', sans-serif;
  font-size: 20px;
  color: rgb(57, 59, 67);
`;

const ListHeader = styled.h4`
  font-family: 'Rubik', sans-serif;
  font-size: 20px;
  font-weight: 400;
  color: rgb(57, 59, 67);
`;

const ListHeaderAccent = styled.span`
  font-family: 'Rubik', sans-serif;
  font-size: 20px;
  font-weight: 400;
  font-style: italic;
  color: rgb(57, 59, 67);
  text-decoration: none;
  border-bottom: 5px solid rgb(82, 231, 185);
`;

const OrderedList = styled.ol``;

const ListItem = styled.li`
  //font-style: italic;
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  color: rgb(57, 59, 67);
  padding-top: 3.5px;
  padding-bottom: 3.5px;
`;

class SummonerError extends Component { 
  render() {
    console.log(this.props.name);
    return (
      <Container>
        <Header>OOPS<HeaderAccent>!</HeaderAccent></Header>
        <SubHeader>We ran into an error accessing {`${this.props.name}`}'s current match.</SubHeader>
        <ListHeader>Here are some <ListHeaderAccent>likely causes:</ListHeaderAccent></ListHeader>
        <OrderedList>
          <ListItem>Incorrect summoner name</ListItem>
          <ListItem>Not playing a ranked 5v5 match</ListItem>
          <ListItem>The summoner isn't currently in game</ListItem>
          <ListItem>Selected the wrong server</ListItem>
        </OrderedList>
      </Container>
    )
  }
}

export default SummonerError