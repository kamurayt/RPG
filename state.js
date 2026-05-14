let saved=loadGame();

let player=saved||{

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

  autoSell:"off"
};

let enemy={};

let currentTab="battleTab";
let equipFilter="all";
let sortType="new";

let bonus={};

function resetBonus(){

  bonus={
    hp:0,
    atk:0,
    def:0,
    exp:0,
    gold:0,
    gacha:0,
    upgrade:0,
    awake:0,
    speed:0,
    multi:0,
    skip:0
  };
}

function calcStats(){

  resetBonus();

  let atk=player.baseAtk*(1+player.goldAtkLv*0.1);
  let def=player.baseDef*(1+player.goldDefLv*0.1);
  let hp=player.baseHp;

  for(const [slot] of slots){

    const index=player.equipped[slot];

    if(index!==null && player.equipments[index]){

      const e=player.equipments[index];

      atk+=equipFinal(e,"atk");
      def+=equipFinal(e,"def");
      hp+=equipFinal(e,"hp");

      applyOption(e.op1);
      applyOption(e.op2);
      applyOption(e.op3);
    }
  }

  atk*=1+bonus.atk/100;
  def*=1+bonus.def/100;
  hp*=1+bonus.hp/100;

  player.atk=Math.floor(atk);
  player.def=Math.floor(def);
  player.maxHp=Math.floor(hp);

  if(player.hp>player.maxHp){
    player.hp=player.maxHp;
  }
}

function applyOption(op){

  if(!op)return;

  const v=getNumber(op);

  if(op.includes("HP"))bonus.hp+=v;
  if(op.includes("攻撃"))bonus.atk+=v;
  if(op.includes("防御"))bonus.def+=v;
  if(op.includes("経験値"))bonus.exp+=v;
  if(op.includes("ゴールド"))bonus.gold+=v;
  if(op.includes("ガチャ"))bonus.gacha+=v;
  if(op.includes("強化素材"))bonus.upgrade+=v;
  if(op.includes("覚醒素材"))bonus.awake+=v;
  if(op.includes("ゲーム速度"))bonus.speed+=v;
  if(op.includes("連撃"))bonus.multi+=v;
  if(op.includes("階層スキップ"))bonus.skip+=v;
}

function getNumber(text){

  const m=String(text).match(/\d+/);

  return m?Number(m[0]):0;
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

function rand(min,max){

  return Math.floor(
    Math.random()*(max-min+1)
  )+min;
}
