function statAddValue(t){

  let c=
    t==="atk"
    ?
    player.atkCount
    :
    t==="def"
    ?
    player.defCount
    :
    player.hpCount;

  let b=
    t==="atk"
    ?
    5
    :
    t==="def"
    ?
    3
    :
    20;

  return b*Math.pow(
    2,
    Math.floor(c/100)
  );
}

function addStat(t,n){

  let done=0;
  let total=0;

  for(let i=0;i<n;i++){

    if(player.point<=0){
      break;
    }

    let add=statAddValue(t);

    player.point--;

    if(t==="atk"){
      player.baseAtk+=add;
      player.atkCount++;
    }

    if(t==="def"){
      player.baseDef+=add;
      player.defCount++;
    }

    if(t==="hp"){
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
    typeLabel(t)+"+"+total
    :
    "ポイント不足"
  );

  saveGame();
  drawCommon();
}

function addStatMax(t){
  addStat(t,player.point);
}

function typeLabel(t){
  return (
    t==="atk"
    ?
    "攻撃"
    :
    t==="def"
    ?
    "防御"
    :
    "HP"
  );
}

function goldUpgrade(t,n){

  let done=0;

  for(let i=0;i<n;i++){

    let lv=
      t==="atk"
      ?
      player.goldAtkLv
      :
      player.goldDefLv;

    let c=goldCost(lv);

    if(player.gold<c){
      break;
    }

    player.gold-=c;

    if(t==="atk"){
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
  drawCommon();
}

function goldUpgradeMax(t){

  let done=0;

  while(true){

    let lv=
      t==="atk"
      ?
      player.goldAtkLv
      :
      player.goldDefLv;

    let c=goldCost(lv);

    if(player.gold<c){
      break;
    }

    player.gold-=c;

    if(t==="atk"){
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
  drawCommon();
}

createEnemy();

drawBattle();
drawCommon();

let last=0;

function loop(time){

  let interval=Math.max(
    100,
    1000-(bonus.speed*5)
  );

  if(time-last>=interval){

    attack();

    last=time;
  }

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
