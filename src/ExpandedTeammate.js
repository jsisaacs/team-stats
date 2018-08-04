import React, { Component } from 'react';
import styled from 'styled-components';
import rp from 'request-promise';

const Modal = styled.div``;
const Content = styled.div``;
const CloseButton = styled.span``;

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
      <Modal>
        <Content>
          <CloseButton onClick={this.handleClick}>&times;</CloseButton>
          <p>This is some text</p>
        </Content>
      </Modal>
    )
  }
}

export default ExpandedTeammate