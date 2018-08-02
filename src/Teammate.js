import React, { Component } from 'react';
import styled from 'styled-components';

const Expand = styled.a``;

const Card = styled.div`
  background: rgb(255, 255, 255);
  transition: 0.3s;
  width: 275px;
  border-radius: 10px;
`;
const Image = styled.img`
  border-radius: 50%;
  width: 45px;
  height: auto;
  justify-content: flex-start;
`;
const Summoner = styled.h3`
  display: inline-block;
  justify-content: flex-end;
`;
const Champion = styled.p`
  //justify-content: flex-end;
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
      <Expand onClick={this.handleClick}>
        <Card>
          <Image src={championImage} alt={this.props.championName} />
          <Summoner>{this.props.summonerName}</Summoner>
          <Champion>{this.props.championName}</Champion>
        </Card>
      </Expand>
    )
  }
}

export default Teammate
