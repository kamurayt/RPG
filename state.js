let save=loadGame();

let player=save||{
  floor:1,
  level:1,

  exp:0,
  gold:0,

  gachaStone:30,
  upgradeStone:0,
  awakeStone:0,

  dungeonKey:0,
  point:0,

  baseHp:100,
  baseAtk:10,
  baseDef:5,

  hp:100,

  goldAtkLv:0,
  goldDefLv:0,

  gachaLv:1,
  gachaExp:0,

  equipments:[],

  equipped:{
    weapon:null,
    head:null,
    armor:null,
    pants:null,
    shoes:null,
    gloves:null,
    wing:null,
    necklace:null,
    bracelet:null,
    pet:null
  },

  dungeon:"normal",

  atkCount:0,
  defCount:0,
  hpCount:0,

  autoSellRank:"off"
};

let enemy={};

let sortType="new";
let equipFilter="all";
let activeTab="battleTab";

let bonus={};

function resetBonus(){
  bonus={
    hp:0,
    atk:0,
    def:0,

    speed:0,
    multi:0,
    skip:0,

    exp:0,
    gold:0,
    gacha:0,
    upgrade:0,
    awake:0
  };
}

function calcStats(){

  resetBonus();

  let atk=
    player.baseAtk*
    (1+player.goldAtkLv*0.1);

  let def=
    player.baseDef*
    (1+player.goldDefLv*0.1);

  let maxHp=player.baseHp;

  for(const [slot] of slots){

    let idx=player.equipped[slot];

    if(idx!==null&&player.equipments[idx]){

      let e=player.equipments[idx];

      atk+=finalEquipPower(e,"atk");
      def+=finalEquipPower(e,"def");
      maxHp+=finalEquipPower(e,"hp");

      [
        e.option1,
        e.option2,
        e.option3
      ].forEach(applyOption);
    }
  }

  maxHp*=1+bonus.hp/100;
  atk*=1+bonus.atk/100;
  def*=1+bonus.def/100;

  player.maxHp=Math.floor(maxHp);
  player.atk=Math.floor(atk);
  player.def=Math.floor(def);

  if(player.hp>player.maxHp){
    player.hp=player.maxHp;
  }
}

function applyOption(op){

  let v=getPercent(op);

  if(op.includes("HP")){
    bonus.hp+=v;
  }

  if(op.includes("攻撃力")){
    bonus.atk+=v;
  }

  if(op.includes("防御力")){
    bonus.def+=v;
  }

  if(op.includes("ゲーム速度")){
    bonus.speed+=v;
  }

  if(op.includes("連撃率")){
    bonus.multi+=v;
  }

  if(op.includes("階層スキップ")){
    bonus.skip+=v;
  }

  if(op.includes("経験値")){
    bonus.exp+=v;
  }

  if(op.includes("ゴールド")){
    bonus.gold+=v;
  }

  if(op.includes("ガチャアイテム")){
    bonus.gacha+=v;
  }

  if(op.includes("強化素材")){
    bonus.upgrade+=v;
  }

  if(op.includes("覚醒素材")){
    bonus.awake+=v;
  }
}

function getPercent(t){
  return Number(
    (t.match(/\d+/)||[0])[0]
  );
}

function rarityIndex(r){
  return Math.max(
    0,
    rarityOrder.indexOf(r)
  );
}

function unlockedRarityIndex(){

  return Math.min(
    rarityOrder.length-1,
    Math.floor((player.gachaLv-1)/8)
  );
}

function unlockedRarities(){

  return rarityOrder.slice(
    0,
    unlockedRarityIndex()+1
  );
}

function needExp(){
  return Math.floor(
    50*Math.pow(1.18,player.level)
  );
}

function needGachaExp(){
  return Math.floor(
    10+player.gachaLv*5
  );
}

function goldCost(lv){
  return Math.floor(
    100*Math.pow(1.25,lv)
  );
}

function randomInt(min,max){

  return Math.floor(
    Math.random()*(max-min+1)
  )+min;
}
