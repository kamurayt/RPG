function equipLimit(e){
  return 10+e.awake*10;
}

function equipFinal(e,type){

  return Math.floor(
    (e[type]||0)*
    (1+e.upgrade*0.1)*
    (1+e.awake*0.2)
  );
}

function equipPower(e){

  return (
    equipFinal(e,"atk")+
    equipFinal(e,"def")+
    Math.floor(equipFinal(e,"hp")/5)
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

  const rarity=rollRarity();

  const r=rarityIndex(rarity);

  const slot=
    slots[
      rand(0,slots.length-1)
    ][0];

  const quality=rand(85,115);

  const base=rand(
    1+r*8,
    8+r*12
  );

  const floorBonus=
    Math.pow(1.08,player.floor);

  const value=Math.floor(
    base*
    floorBonus*
    quality/100
  );

  const e={
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

    op1:randomOption(rarity,slot),
    op2:randomOption(rarity,slot),
    op3:randomOption(rarity,slot)
  };

  if(slot==="weapon"){
    e.atk=value*3;
  }

  else if(
    ["head","armor","pants","gloves"]
    .includes(slot)
  ){
    e.def=value*2;
    e.hp=value*5;
  }

  else if(
    ["shoes","wing"]
    .includes(slot)
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

  let list=[
    "HP増加",
    "攻撃力増加",
    "防御力増加",
    "獲得経験値増加",
    "獲得ゴールド増加",
    "獲得ガチャアイテム増加",
    "獲得強化素材増加",
    "獲得覚醒素材増加",
    "ゲーム速度上昇",
    "連撃率上昇",
    "階層スキップ数"
  ];

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
      "獲得強化素材増加",
      "獲得覚醒素材増加"
    ]);
  }

  const r=rarityIndex(rarity);

  const min=1+r*5;

  const max=Math.min(
    100,
    min+4+r*2
  );

  return (
    list[rand(0,list.length-1)]+
    " +"+
    rand(min,max)+
    "%"
  );
}

function isEquipped(index){

  return Object.values(player.equipped)
    .includes(index);
}

function equipItem(index){

  const e=player.equipments[index];

  if(!e)return;

  player.equipped[e.slot]=index;

  showEffect(
    slotName(e.slot)+"装備"
  );

  saveGame();
  drawAll();
}

function removeEquipment(index){

  player.equipments.splice(index,1);

  for(const key in player.equipped){

    const v=player.equipped[key];

    if(v===index){
      player.equipped[key]=null;
    }

    else if(v!==null && v>index){
      player.equipped[key]--;
    }
  }
}

function sellGain(e){

  const r=rarityIndex(e.rarity);

  return {
    upgrade:1+r*3+e.upgrade,
    awake:Math.floor(r/2)+e.awake
  };
}

function sellEquip(index){

  if(isEquipped(index)){
    showEffect("装備中は売却不可");
    return;
  }

  const e=player.equipments[index];

  if(!e)return;

  const gain=sellGain(e);

  player.upgradeStone+=gain.upgrade;
  player.awakeStone+=gain.awake;

  removeEquipment(index);

  showEffect(
    "売却 強化+"+
    gain.upgrade+
    " 覚醒+"+
    gain.awake
  );

  saveGame();
  drawAll();
}

function sellAll(rarity){

  const limit=rarityIndex(rarity);

  let sold=0;
  let up=0;
  let aw=0;

  for(let i=player.equipments.length-1;i>=0;i--){

    const e=player.equipments[i];

    if(
      !isEquipped(i) &&
      rarityIndex(e.rarity)<=limit
    ){
      const gain=sellGain(e);

      up+=gain.upgrade;
      aw+=gain.awake;
      sold++;

      removeEquipment(i);
    }
  }

  player.upgradeStone+=up;
  player.awakeStone+=aw;

  showEffect(
    sold+"個売却"
  );

  saveGame();
  drawAll();
}

function upgradeEquip(index,times){

  const e=player.equipments[index];

  if(!e)return;

  let done=0;

  for(let i=0;i<times;i++){

    if(e.upgrade>=equipLimit(e)){
      break;
    }

    const gold=upgradeGoldCost(e);
    const stone=upgradeStoneCost(e);

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
  drawAll();
}

function upgradeEquipMax(index){

  upgradeEquip(index,999999);
}

function awakeEquip(index){

  const e=player.equipments[index];

  if(!e)return;

  const cost=awakeStoneCost(e);

  if(player.awakeStone<cost){
    showEffect("覚醒素材不足");
    return;
  }

  player.awakeStone-=cost;

  e.awake++;

  showEffect("覚醒+"+e.awake);

  saveGame();
  drawAll();
}

function optionScore(e,key){

  return (
    [e.op1,e.op2,e.op3]
    .filter(op=>op&&op.includes(key))
    .reduce((sum,op)=>sum+getNumber(op),0)
  );
}

function sortedEquipments(){

  let list=player.equipments
    .map((e,i)=>({e,i}));

  if(equipFilter!=="all"){

    list=list.filter(
      v=>v.e.slot===equipFilter
    );
  }

  list.sort((a,b)=>{

    const ea=a.e;
    const eb=b.e;

    if(sortType==="rarity"){
      return rarityIndex(eb.rarity)-
      rarityIndex(ea.rarity);
    }

    if(sortType==="power"){
      return equipPower(eb)-equipPower(ea);
    }

    if(sortType==="upgrade"){
      return eb.upgrade-ea.upgrade;
    }

    if(sortType==="awake"){
      return eb.awake-ea.awake;
    }

    return b.i-a.i;
  });

  return list;
}

function setEquipFilter(slot){

  equipFilter=slot;

  drawEquip();
}

function setAutoSell(value){

  player.autoSell=value;

  saveGame();

  drawEquip();
}

function shouldAutoSell(e){

  return (
    player.autoSell!=="off" &&
    rarityIndex(e.rarity)<=
    rarityIndex(player.autoSell)
  );
}
