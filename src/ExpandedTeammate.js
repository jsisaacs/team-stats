import React, { Component } from 'react';
import styled from 'styled-components';
import Statistics from './Statistics';

const Modal = styled.div`
  display: block;
  position: fixed;
  z-index: 1;
  padding-top: 100px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
`;

const Content = styled.div`
  background-color: #fefefe;
  border-radius: 4px;
  margin: auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
`;

const CloseButton = styled.span`
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }
`;

class ExpandedTeammate extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.changeExpansion(this.props.summonerName);
  }
  
  render() {
    return (
      <Modal className="modal">
        <Content>
          <CloseButton onClick={this.handleClick}>&times;</CloseButton>
          <Statistics/>
          <p>{this.props.championStatistics.cs}</p>
        </Content>
      </Modal>
    )
  }
}

export default ExpandedTeammate