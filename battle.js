function createEnemy(){

  const boss=player.floor%5===0;

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
}

function drop(base,bonusValue){

  return (
    Math.random()*100<
    Math.min(100,base+bonusValue)
  );
}

function attack(){

  calcStats();

  let damage=Math.max(
    1,
    player.atk-
    Math.floor(player.floor/2)
  );

  enemy.hp-=damage;

  if(enemy.hp<0){
    enemy.hp=0;
  }

  let log=
    "与ダメージ："+damage;

  if(Math.random()*100<bonus.multi){

    enemy.hp-=damage;

    if(enemy.hp<0){
      enemy.hp=0;
    }

    log+="<br>連撃！+"+damage;
  }

  setBattleLog(log);

  if(enemy.hp<=0){
    winBattle();
  }

  else{
    enemyAttack();
  }

  drawAll();
}

function enemyAttack(){

  let damage=Math.max(
    1,
    enemy.atk-player.def
  );

  player.hp-=damage;

  if(player.hp<0){
    player.hp=0;
  }

  addBattleLog(
    "被ダメージ："+damage
  );

  if(player.hp<=0){

    player.floor=Math.max(
      1,
      player.floor-1
    );

    player.hp=player.maxHp;

    showEffect("敗北");

    createEnemy();
  }
}

function rewardMult(){

  if(player.dungeon==="gold"){
    return {g:5,e:1,u:0.5,a:0,ga:0.5};
  }

  if(player.dungeon==="upgrade"){
    return {g:0.5,e:1,u:5,a:0,ga:0.5};
  }

  if(player.dungeon==="awake"){
    return {g:0.5,e:1,u:0.5,a:5,ga:0.5};
  }

  if(player.dungeon==="gacha"){
    return {g:0.5,e:1,u:0.5,a:0,ga:5};
  }

  return {g:1,e:1,u:1,a:0,ga:1};
}

function winBattle(){

  calcStats();

  const m=rewardMult();

  const bossBonus=
    enemy.boss
    ?
    6
    :
    1;

  const gold=Math.floor(
    20*
    Math.pow(1.14,player.floor)*
    bossBonus*
    m.g*
    (1+bonus.gold/100)
  );

  const exp=Math.floor(
    12*
    Math.pow(1.13,player.floor)*
    bossBonus*
    m.e*
    (1+bonus.exp/100)
  );

  let gacha=0;
  let upgrade=0;
  let awake=0;

  if(enemy.boss || drop(20,bonus.gacha)){

    gacha=Math.floor(
      (enemy.boss?8:1)*
      Math.pow(1.05,player.floor)*
      m.ga
    );
  }

  if(enemy.boss || drop(50,bonus.upgrade)){

    upgrade=Math.floor(
      (enemy.boss?15:1)*
      Math.pow(1.04,player.floor)*
      m.u
    );
  }

  if(enemy.boss || drop(25,bonus.awake)){

    awake=Math.floor(
      (enemy.boss?3:1)*
      Math.pow(1.03,player.floor)*
      m.a
    );
  }

  player.gold+=gold;
  player.exp+=exp;
  player.gachaStone+=Math.max(0,gacha);
  player.upgradeStone+=Math.max(0,upgrade);
  player.awakeStone+=Math.max(0,awake);

  if(
    enemy.boss &&
    player.dungeon==="normal"
  ){
    player.dungeonKey++;
  }

  setBattleLog(
    enemy.name+
    "撃破！<br>"+
    "+"+gold+"G "+
    "+"+exp+"EXP<br>"+
    "ガチャ+"+gacha+
    " 強化+"+upgrade+
    " 覚醒+"+awake
  );

  while(player.exp>=needExp()){

    player.exp-=needExp();

    player.level++;

    player.point+=5;

    player.baseHp+=20;

    player.hp=player.maxHp;

    showEffect("レベルUP");
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
      showEffect("鍵不足");
      return;
    }

    player.dungeonKey--;
  }

  player.dungeon=type;

  player.floor=1;

  player.hp=player.maxHp;

  createEnemy();

  showEffect(
    dungeonName()+"へ移動"
  );

  saveGame();

  drawAll();
}
