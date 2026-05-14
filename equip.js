function getRates(){

  let lv=player.gachaLv;

  let rates={};

  rarityOrder.forEach((r,i)=>{

    let unlock=i*8+1;

    rates[r]=
      lv>=unlock
      ?
      Math.max(
        0.01,
        100/Math.pow(i+1,2.2)
      )
      :
      0;
  });

  let total=Object.values(rates)
    .reduce((a,b)=>a+b,0);

  rarityOrder.forEach(r=>{
    rates[r]=rates[r]/total*100;
  });

  return rates;
}

function rollRarity(){

  let rates=getRates();

  let rand=Math.random()*100;

  let sum=0;

  for(let r of rarityOrder){

    sum+=rates[r];

    if(rand<=sum){
      return r;
    }
  }

  return "N";
}

function createEquipment(){

  let rarity=rollRarity();

  let r=rarityIndex(rarity);

  let slot=
    slots[
      randomInt(0,slots.length-1)
    ][0];

  let floorBonus=
    Math.pow(1.08,player.floor);

  let base=
    randomInt(
      1+r*8,
      8+r*12
    );

  let quality=
    randomInt(85,115);

  let value=
    Math.floor(
      base*
      floorBonus*
      quality/100
    );

  let e={
    id:Date.now()+Math.random(),

    slot,
    name:equipName(slot),
    rarity,
    quality,

    atk:0,
    def:0,
    hp:0,

    upgrade:0,
    awake:0,

    option1:randomOption(rarity,slot),
    option2:randomOption(rarity,slot),
    option3:randomOption(rarity,slot)
  };

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

  else{
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

  if(slot==="necklace"){
    list=list.concat([
      "獲得経験値増加",
      "獲得ゴールド増加"
    ]);
  }

  if(slot==="pet"){
    list=list.concat([
      "獲得ガチャアイテム増加",
      "獲得装備強化素材増加",
      "獲得装備覚醒素材増加"
    ]);
  }

  let r=rarityIndex(rarity);

  let min=1+r*5;

  let max=Math.min(
    100,
    min+4+r*2
  );

  return (
    list[randomInt(0,list.length-1)]+
    " +"+
    randomInt(min,max)+
    "%"
  );
}

function shouldAutoSell(e){

  return (
    player.autoSellRank!=="off" &&
    rarityIndex(e.rarity)<=
    rarityIndex(player.autoSellRank)
  );
}

function gacha(count){

  let results=[];

  let sold=0;
  let gainUp=0;
  let gainAw=0;

  for(let i=0;i<count;i++){

    if(player.gachaStone<=0){
      break;
    }

    player.gachaStone--;

    let e=createEquipment();

    if(shouldAutoSell(e)){

      let g=sellGain(e);

      player.upgradeStone+=g.up;
      player.awakeStone+=g.aw;

      gainUp+=g.up;
      gainAw+=g.aw;

      sold++;
    }

    else{

      player.equipments.push(e);

      if(results.length<20){

        results.push(
          `<span style="color:${rarityColors[e.rarity]}">`+
          `${e.rarity}</span> `+
          `${slotName(e.slot)} ${e.name}`
        );
      }
    }

    player.gachaExp++;

    while(
      player.gachaExp>=needGachaExp()
    ){
      player.gachaExp-=needGachaExp();
      player.gachaLv++;
      showEffect("ガチャLvUP！");
    }
  }

  document.getElementById("gachaResult")
    .innerHTML=
    `入手表示：${results.length}件<br>`+
    results.join("<br>")+
    `<br>自動売却：${sold}個`+
    `<br>強化素材+${gainUp} 覚醒素材+${gainAw}`;

  saveGame();

  drawCommon();

  if(activeTab==="equipTab"){
    renderEquipList();
  }
}
