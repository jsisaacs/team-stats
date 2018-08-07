import React, { Component } from 'react';
import styled from 'styled-components';

const Card = styled.div.attrs({
  background: props => props.team,
  float: props => props.side,
  outline: props => props.outline
})`
  background: ${props => props.background};
  float: ${props => props.float};
  border-color: ${props => props.outline};
  border-width: 2px;
  border-style: solid;
  border-radius: 4px; 
  width: 325px;
  height: 100px;
  margin: 15px;

  &:hover {
    box-shadow: 0px 0px 20px lightgrey;
    z-index: 2;
    -webkit-transition: all 200ms ease-in;
    -webkit-transform: scale(1.1);
    -ms-transition: all 200ms ease-in;
    -ms-transform: scale(1.1);   
    -moz-transition: all 200ms ease-in;
    -moz-transform: scale(1.1);
    transition: all 125ms ease-in;
    transform: scale(1.1);
  }
`;

const Image = styled.img.attrs({
  imageoutlinecolor: props => props.outline
})`
  border-color: ${props => props.imageoutlinecolor};
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  width: 70px;
  height: auto;
  margin: 15px 15px 15px 15px;
  float: left;
`;

const Text = styled.div`
  float: left;
  padding-top: 0px;
  padding-right: 15px;
`;

const Summoner = styled.h3.attrs({
  color: props => props.fontColor
})`
  color: ${props => props.color};
  font-family: 'Rubik', sans-serif;
  font-weight: bold;
  font-size: 22.5px;
`;

const Champion = styled.p.attrs({
  color: props => props.fontColor
})`
  text-align: left;
  margin-top:-10px;
  color: ${props => props.color};
  font-family: 'Rubik', sans-serif;
  font-weight: light;
  font-size: 17.5px;
`;

class Teammate extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.changeExpansion(this.props.summonerName);
  }
  
  render() {
    let championNameConversions = new Map();
    championNameConversions.set("Aurelion Sol",  "AurelionSol");
    championNameConversions.set("Cho'Gath", "Chogath");
    championNameConversions.set("Dr. Mundo", "DrMundo");
    championNameConversions.set("Jarvan IV", "JarvanIV");
    championNameConversions.set("Kai'Sa", "Kaisa");
    championNameConversions.set("Kha'Zix", "Khazix");
    championNameConversions.set("Kog'Maw", "KogMaw");
    championNameConversions.set("LeBlanc", "Leblanc");
    championNameConversions.set("Lee Sin", "LeeSin");
    championNameConversions.set("Master Yi", "MasterYi");
    championNameConversions.set("Wukong", "MonkeyKing");
    championNameConversions.set("Miss Fortune", "MissFortune");
    championNameConversions.set("Rek'Sai", "RekSai");
    championNameConversions.set("Tahm Kench", "TahmKench");
    championNameConversions.set("Twisted Fate", "TwistedFate");
    championNameConversions.set("Vel'Koz", "Velkoz");
    championNameConversions.set("Xin Zhao", "XinZhao");

    let championName = "";
    let championImage = "";
    const version = "8.15.1";

    if (championNameConversions.get(this.props.championName)) {
        championName = championNameConversions.get(this.props.championName);
        championImage = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
    } else {
      championImage = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${this.props.championName}.png`;
    }

    return (
        <Card onClick={this.handleClick} team={this.props.team} side={this.props.side} outline={this.props.outlineColor}>
          <Image src={championImage} alt={this.props.championName} outline={this.props.outlineColor}/>
          <Text>
            <Summoner fontColor={this.props.fontColor}>{this.props.summonerName}</Summoner>
            <Champion fontColor={this.props.fontColor}>{this.props.championName}</Champion>
          </Text>
        </Card>
    )
  }
}

export default Teammate
