function upgradeLimit(e){
  return 10 + e.awake * 10;
}

function finalEquipPower(e,type){

  return Math.floor(
    (e[type] || 0) *
    (1 + e.upgrade * 0.1) *
    (1 + e.awake * 0.2)
  );
}

function equipScore(e){

  return (
    finalEquipPower(e,"atk") +
    finalEquipPower(e,"def") +
    finalEquipPower(e,"hp") / 5
  );
}

function optionValue(e,key){

  let total=0;

  [
    e.option1,
    e.option2,
    e.option3
  ].forEach(op=>{

    if(op.includes(key)){
      total += getPercent(op);
    }
  });

  return total;
}

function sortedEquipments(){

  let arr=
    player.equipments
    .map((e,i)=>({e,i}));

  if(equipFilter!=="all"){

    arr=arr.filter(v=>
      v.e.slot===equipFilter
    );
  }

  arr.sort((a,b)=>{

    let ea=a.e;
    let eb=b.e;

    if(sortType==="rarity"){
      return rarityIndex(eb.rarity)
      - rarityIndex(ea.rarity);
    }

    if(sortType==="power"){
      return equipScore(eb)
      - equipScore(ea);
    }

    if(sortType==="upgrade"){
      return eb.upgrade-ea.upgrade;
    }

    if(sortType==="awake"){
      return eb.awake-ea.awake;
    }

    if(sortType==="exp"){
      return optionValue(eb,"経験値")
      - optionValue(ea,"経験値");
    }

    if(sortType==="gold"){
      return optionValue(eb,"ゴールド")
      - optionValue(ea,"ゴールド");
    }

    if(sortType==="gacha"){
      return optionValue(eb,"ガチャ")
      - optionValue(ea,"ガチャ");
    }

    if(sortType==="upgradeMat"){
      return optionValue(eb,"強化素材")
      - optionValue(ea,"強化素材");
    }

    if(sortType==="awakeMat"){
      return optionValue(eb,"覚醒素材")
      - optionValue(ea,"覚醒素材");
    }

    if(sortType==="speed"){
      return optionValue(eb,"ゲーム速度")
      - optionValue(ea,"ゲーム速度");
    }

    if(sortType==="multi"){
      return optionValue(eb,"連撃率")
      - optionValue(ea,"連撃率");
    }

    if(sortType==="skip"){
      return optionValue(eb,"階層スキップ")
      - optionValue(ea,"階層スキップ");
    }

    return eb.id-ea.id;
  });

  return arr;
}

function isEquipped(index){

  return Object.values(
    player.equipped
  ).includes(index);
}

function setEquipFilter(v){

  equipFilter=v;

  renderEquipList();
}

function setAutoSell(v){

  player.autoSellRank=v;

  saveGame();
}

function equipItem(index){

  let e=player.equipments[index];

  player.equipped[e.slot]=index;

  showEffect(
    slotName(e.slot)+"装備"
  );

  saveGame();

  drawCommon();
  renderEquipList();
}

function sellGain(e){

  let r=rarityIndex(e.rarity);

  return {
    up:
      1 +
      r*3 +
      e.upgrade,

    aw:
      Math.floor(r/2) +
      e.awake
  };
}

function sellEquip(index){

  if(!player.equipments[index]){
    return;
  }

  let e=player.equipments[index];

  let gain=sellGain(e);

  player.upgradeStone += gain.up;
  player.awakeStone += gain.aw;

  for(let k in player.equipped){

    if(player.equipped[k]===index){
      player.equipped[k]=null;
    }

    else if(player.equipped[k]>index){
      player.equipped[k]--;
    }
  }

  player.equipments.splice(index,1);

  showEffect(
    "売却：強化+"+
    gain.up+
    " 覚醒+"+
    gain.aw
  );

  saveGame();

  drawCommon();
  renderEquipList();
}

function sellAll(rarity){

  let target=
    rarityIndex(rarity);

  let keep=[];

  let gainUp=0;
  let gainAw=0;
  let sold=0;

  player.equipments.forEach((e)=>{

    let equipped=
      Object.values(
        player.equipped
      ).includes(
        player.equipments.indexOf(e)
      );

    if(
      !equipped &&
      rarityIndex(e.rarity)<=target
    ){

      let g=sellGain(e);

      gainUp+=g.up;
      gainAw+=g.aw;

      sold++;
    }

    else{
      keep.push(e);
    }
  });

  player.equipments=keep;

  for(let k in player.equipped){
    player.equipped[k]=null;
  }

  player.upgradeStone+=gainUp;
  player.awakeStone+=gainAw;

  showEffect(
    sold+
    "個売却"
  );

  saveGame();

  drawCommon();
  renderEquipList();
}

function upgradeGoldCost(e){

  return Math.floor(
    (80 + rarityIndex(e.rarity)*25) *
    Math.pow(1.18,e.upgrade)
  );
}

function upgradeStoneCost(e){

  return (
    1 +
    Math.floor(e.upgrade/5) +
    rarityIndex(e.rarity)
  );
}

function awakeStoneCost(e){

  return Math.floor(
    (5 + rarityIndex(e.rarity)*4) *
    Math.pow(e.awake+1,2)
  );
}

function upgradeItem(index,times){

  let e=player.equipments[index];

  let done=0;

  for(let i=0;i<times;i++){

    if(
      e.upgrade>=upgradeLimit(e)
    ){
      break;
    }

    let gold=
      upgradeGoldCost(e);

    let stone=
      upgradeStoneCost(e);

    if(
      player.gold<gold ||
      player.upgradeStone<stone
    ){
      break;
    }

    player.gold-=gold;
    player.upgradeStone-=stone;

    e.upgrade++;

    done++;
  }

  showEffect(
    done>0
    ?
    "強化+"+done
    :
    "素材不足"
  );

  saveGame();

  drawCommon();
  renderEquipList();
}

function upgradeMax(index){
  upgradeItem(index,999999);
}

function awakeItem(index){

  let e=player.equipments[index];

  let cost=
    awakeStoneCost(e);

  if(player.awakeStone<cost){
    showEffect("覚醒素材不足");
    return;
  }

  player.awakeStone-=cost;

  e.awake++;

  showEffect(
    "覚醒+"+e.awake
  );

  saveGame();

  drawCommon();
  renderEquipList();
}
