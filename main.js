function statAddValue(type){

  const count=
    type==="atk"
    ?
    player.atkCount
    :
    type==="def"
    ?
    player.defCount
    :
    player.hpCount;

  const base=
    type==="atk"
    ?
    5
    :
    type==="def"
    ?
    3
    :
    20;

  return base*Math.pow(
    2,
    Math.floor(count/100)
  );
}

function addStat(type,times){

  let done=0;
  let total=0;

  for(let i=0;i<times;i++){

    if(player.point<=0){
      break;
    }

    const add=statAddValue(type);

    player.point--;

    if(type==="atk"){
      player.baseAtk+=add;
      player.atkCount++;
    }

    if(type==="def"){
      player.baseDef+=add;
      player.defCount++;
    }

    if(type==="hp"){
      player.baseHp+=add;
      player.hp+=add;
      player.hpCount++;
    }

    total+=add;
    done++;
  }

  showEffect(
    done>0
    ?
    "強化+"+total
    :
    "ポイント不足"
  );

  saveGame();
  drawAll();
}

function addStatMax(type){
  addStat(type,player.point);
}

function goldUpgrade(type,times){

  let done=0;

  for(let i=0;i<times;i++){

    const lv=
      type==="atk"
      ?
      player.goldAtkLv
      :
      player.goldDefLv;

    const cost=goldCost(lv);

    if(player.gold<cost){
      break;
    }

    player.gold-=cost;

    if(type==="atk"){
      player.goldAtkLv++;
    }

    else{
      player.goldDefLv++;
    }

    done++;
  }

  showEffect(
    done>0
    ?
    "ゴールド強化+"+done
    :
    "ゴールド不足"
  );

  saveGame();
  drawAll();
}

function goldUpgradeMax(type){

  let done=0;

  while(true){

    const lv=
      type==="atk"
      ?
      player.goldAtkLv
      :
      player.goldDefLv;

    const cost=goldCost(lv);

    if(player.gold<cost){
      break;
    }

    player.gold-=cost;

    if(type==="atk"){
      player.goldAtkLv++;
    }

    else{
      player.goldDefLv++;
    }

    done++;

    if(done>100000){
      break;
    }
  }

  showEffect(
    done>0
    ?
    "最大強化+"+done
    :
    "ゴールド不足"
  );

  saveGame();
  drawAll();
}

createEnemy();

drawAll();

let last=0;

function gameLoop(time){

  const interval=Math.max(
    100,
    1000-bonus.speed*5
  );

  if(time-last>=interval){

    attack();

    last=time;
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
