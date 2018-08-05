import React, { Component } from 'react';
import styled from 'styled-components';

const Card = styled.div.attrs({
  background: props => props.team,
  float: props => props.side
})`
  background: ${props => props.background};
  border-radius: 4px; 
  width: 325px;
  height: 100px;
  margin: 15px;
  float: ${props => props.float};
`;

const Image = styled.img`
  border-radius: 50%;
  width: 70px;
  height: auto;
  margin: 15px 15px 15px 15px;
  float: left;
`;

const Text = styled.div`
  float: left;
  padding-top: 7px;
  padding-right: 15px;
`;

const Summoner = styled.h3`
  color: white;
`;

const Champion = styled.p`
  text-align: left;
  margin-top:-10px;
  color: white;
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
        <Card onClick={this.handleClick} team={this.props.team} side={this.props.side}>
          <Image src={championImage} alt={this.props.championName} />
          <Text>
            <Summoner>{this.props.summonerName}</Summoner>
            <Champion>{this.props.championName}</Champion>
          </Text>
        </Card>
    )
  }
}

export default Teammate
