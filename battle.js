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

  if(enemy.boss || dropChance(20,bonus.gacha)){

    gachaItem=Math.floor(
      (enemy.boss?8:1)*
      Math.pow(1.05,player.floor)*
      m.ga
    );
  }

  if(enemy.boss || dropChance(50,bonus.upgrade)){

    upgrade=Math.floor(
      (enemy.boss?15:1)*
      Math.pow(1.04,player.floor)*
      m.u
    );
  }

  if(enemy.boss || dropChance(25,bonus.awake)){

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
