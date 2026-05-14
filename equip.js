function upgradeLimit(e){
  return 10+e.awake*10;
}

function finalEquipPower(e,type){

  return Math.floor(
    (e[type]||0)*
    (1+e.upgrade*0.1)*
    (1+e.awake*0.2)
  );
}

function equipScore(e){

  return (
    finalEquipPower(e,"atk")+
    finalEquipPower(e,"def")+
    finalEquipPower(e,"hp")/5
  );
}

function upgradeGoldCost(e){

  return Math.floor(
    (80+rarityIndex(e.rarity)*25)*
    Math.pow(1.18,e.upgrade)
  );
}

function upgradeStoneCost(e){

  return (
    1+
    Math.floor(e.upgrade/5)+
    rarityIndex(e.rarity)
  );
}

function awakeStoneCost(e){

  return Math.floor(
    (5+rarityIndex(e.rarity)*4)*
    Math.pow(e.awake+1,2)
  );
}

function createEquipment(){

  let rarity=rollRarity();

  let i=rarityIndex(rarity);

  let slot=
    slots[
      randomInt(0,slots.length-1)
    ][0];

  let baseMin=1+i*8;
  let baseMax=baseMin+7+i*3;

  let base=randomInt(baseMin,baseMax);

  let floorBonus=Math.pow(
    1.08,
    player.floor
  );

  let rand=randomInt(85,115)/100;

  let e={
    id:Date.now()+Math.random(),

    slot,
    name:equipName(slot),

    rarity,

    quality:Math.floor(rand*100),

    upgrade:0,
    awake:0,

    atk:0,
    def:0,
    hp:0,

    option1:randomOption(rarity,slot),
    option2:randomOption(rarity,slot),
    option3:randomOption(rarity,slot)
  };

  let value=Math.floor(
    base*
    floorBonus*
    rand
  );

  if(slot==="weapon"){
    e.atk=value*3;
  }

  else if(
    [
      "head",
      "armor",
      "pants",
      "gloves"
    ].includes(slot)
  ){
    e.def=value*2;
    e.hp=value*5;
  }

  else if(
    [
      "shoes",
      "wing"
    ].includes(slot)
  ){
    e.def=value;
    e.hp=value*3;
  }

  else if(
    [
      "necklace",
      "bracelet",
      "pet"
    ].includes(slot)
  ){
    e.atk=value;
    e.hp=value*2;
  }

  return e;
}

function randomOption(rarity,slot){

  let common=[
    "HP増加",
    "攻撃力増加",
    "防御力増加",
    "獲得経験値増加",
    "獲得ゴールド増加",
    "獲得ガチャアイテム増加",
    "獲得装備強化素材増加",
    "獲得装備覚醒素材増加"
  ];

  let special=[
    "ゲーム速度上昇",
    "連撃率上昇",
    "階層スキップ数"
  ];

  let list=common.concat(special);

  if(slot==="shoes"){
    list=list.concat([
      "ゲーム速度上昇",
      "ゲーム速度上昇"
    ]);
  }

  if(slot==="wing"){
    list=list.concat([
      "階層スキップ数",
      "階層スキップ数"
    ]);
  }

  if(slot==="bracelet"){
    list=list.concat([
      "連撃率上昇",
      "連撃率上昇"
    ]);
  }

  let i=rarityIndex(rarity);

  let min=1+i*5;

  let max=Math.min(
    100,
    min+4+i*2
  );

  return (
    list[
      randomInt(0,list.length-1)
    ]+
    " +"+
    randomInt(min,max)+
    "%"
  );
}

function equipItem(index){

  let e=player.equipments[index];

  player.equipped[e.slot]=index;

  showEffect(
    slotName(e.slot)+"装備変更"
  );

  saveGame();
  drawCommon();
  renderEquipList();
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
      player.gold<gold||
      player.upgradeStone<stone
    ){
      break;
    }

    player.gold-=gold;
    player.upgradeStone-=stone;

    e.upgrade++;

    done++;
  }

  if(done===0){

    if(
      e.upgrade>=upgradeLimit(e)
    ){
      showEffect("強化上限");
    }

    else{
      showEffect("素材不足");
    }
  }

  else{
    showEffect(
      "強化+"+done
    );
  }

  saveGame();

  drawCommon();
  renderEquipList();
}

function upgradeMax(index){
  upgradeItem(index,999999);
}
