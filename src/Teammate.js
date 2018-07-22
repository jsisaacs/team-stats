import React, { Component } from 'react'

class Teammate extends Component {
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
    const version = "8.14.1";

    if (championNameConversions.get(this.props.championName)) {
        championName = championNameConversions.get(this.props.championName);
        championImage = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
        console.log(championImage);
    } else {
      championImage = `http://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${this.props.championName}.png`;
    }

    return (
      <div>
        <img src={championImage} alt={this.props.championName}/>
        <h3>{this.props.summonerName}</h3>
        <p>{this.props.championName}</p>
        <hr/>
      </div>
    )
  }
}

export default Teammate
