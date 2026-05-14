function createEnemy(){

  let boss=
    player.floor%5===0;

  enemy={

    name:
      boss
      ?
      "階層ボス"
      :
      enemyName(),

    maxHp:Math.floor(
      50*
      Math.pow(1.13,player.floor)*
      (boss?3:1)
    ),

    hp:0,

    atk:Math.floor(
      5*
      Math.pow(1.11,player.floor)*
      (boss?1.8:1)
    ),

    boss
  };

  enemy.hp=enemy.maxHp;

  drawBattle();
  drawCommon();
}

function dropChance(base,bonusVal){

  return (
    Math.random()*100<
    Math.min(
      100,
      base+bonusVal
    )
  );
}

function attack(){

  calcStats();

  let dmg=Math.max(
    1,
    player.atk-
    Math.floor(player.floor/2)
  );

  enemy.hp-=dmg;

  if(enemy.hp<0){
    enemy.hp=0;
  }

  let log=
    "与ダメージ："+dmg;

  if(Math.random()*100<bonus.multi){

    enemy.hp-=dmg;

    if(enemy.hp<0){
      enemy.hp=0;
    }

    log+=
      "<br>連撃発動！ +"+
      dmg;
  }

  battleLog(log);

  if(enemy.hp<=0){
    winBattle();
  }

  else{
    enemyAttack();
  }

  drawBattle();
  drawCommon();
}

function enemyAttack(){

  let dmg=Math.max(
    1,
    enemy.atk-player.def
  );

  player.hp-=dmg;

  if(player.hp<0){
    player.hp=0;
  }

  battleLogAdd(
    "被ダメージ："+dmg
  );

  if(player.hp<=0){

    player.floor=Math.max(
      1,
      player.floor-1
    );

    player.hp=player.maxHp;

    showEffect(
      "敗北…1階戻った"
    );

    createEnemy();
  }
}

function rewardMult(){

  if(player.dungeon==="gold"){
    return {
      g:5,
      e:1,
      u:.5,
      a:0,
      ga:.5
    };
  }

  if(player.dungeon==="upgrade"){
    return {
      g:.5,
      e:1,
      u:5,
      a:0,
      ga:.5
    };
  }

  if(player.dungeon==="awake"){
    return {
      g:.5,
      e:1,
      u:.5,
      a:5,
      ga:.5
    };
  }

  if(player.dungeon==="gacha"){
    return {
      g:.5,
      e:1,
      u:.5,
      a:0,
      ga:5
    };
  }

  return {
    g:1,
    e:1,
    u:1,
    a:0,
    ga:1
  };
}

function winBattle(){

  calcStats();

  let m=rewardMult();

  let bossBonus=
    enemy.boss
    ?
    6
    :
    1;

  let gold=Math.floor(
    20*
    Math.pow(1.14,player.floor)*
    bossBonus*
    m.g*
    (1+bonus.gold/100)
  );

  let exp=Math.floor(
    12*
    Math.pow(1.13,player.floor)*
    bossBonus*
    m.e*
    (1+bonus.exp/100)
  );

  let gachaItem=0;
  let upgrade=0;
  let awake=0;

  if(dropChance(20,bonus.gacha)){

    gachaItem=Math.floor(
      (enemy.boss?8:1)*
      Math.pow(1.05,player.floor)*
      m.ga
    );
  }

  if(dropChance(50,bonus.upgrade)){

    upgrade=Math.floor(
      (enemy.boss?15:1)*
      Math.pow(1.04,player.floor)*
      m.u
    );
  }

  if(dropChance(25,bonus.awake)){

    awake=Math.floor(
      (enemy.boss?3:1)*
      Math.pow(1.03,player.floor)*
      m.a
    );
  }

  player.gold+=gold;
  player.exp+=exp;

  player.gachaStone+=
    Math.max(0,gachaItem);

  player.upgradeStone+=
    Math.max(0,upgrade);

  player.awakeStone+=
    Math.max(0,awake);

  if(
    enemy.boss &&
    player.dungeon==="normal"
  ){
    player.dungeonKey++;
  }

  battleLog(
    enemy.name+
    "撃破！<br>"+
    "+"+gold+
    "G +"+
    exp+
    "EXP<br>"+
    "ガチャ+"+
    gachaItem+
    " 強化素材+"+
    upgrade+
    " 覚醒素材+"+
    awake
  );

  while(player.exp>=needExp()){

    player.exp-=needExp();

    player.level++;

    player.point+=5;

    player.baseHp+=20;

    player.hp=player.maxHp;

    showEffect(
      "レベルアップ！"
    );
  }

  player.floor+=
    1+
    Math.floor(bonus.skip/100);

  createEnemy();

  saveGame();
}

function changeDungeon(type){

  if(type!=="normal"){

    if(player.dungeonKey<=0){
      showEffect("鍵が足りない");
      return;
    }

    player.dungeonKey--;
  }

  player.dungeon=type;

  player.floor=1;

  player.hp=player.maxHp;

  showEffect(
    dungeonName()+"へ移動"
  );

  createEnemy();

  saveGame();

  drawCommon();
}
