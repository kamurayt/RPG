function getRates(){

  const lv=player.gachaLv;

  const rates={};

  rarityOrder.forEach((r,i)=>{

    const unlock=i*8+1;

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

  const total=Object.values(rates)
    .reduce((a,b)=>a+b,0);

  rarityOrder.forEach(r=>{
    rates[r]=rates[r]/total*100;
  });

  return rates;
}

function rollRarity(){

  const rates=getRates();

  const randValue=Math.random()*100;

  let sum=0;

  for(const r of rarityOrder){

    sum+=rates[r];

    if(randValue<=sum){
      return r;
    }
  }

  return "N";
}

function drawGacha(count){

  let result=[];
  let sold=0;
  let up=0;
  let aw=0;

  for(let i=0;i<count;i++){

    if(player.gachaStone<=0){
      break;
    }

    player.gachaStone--;

    const e=createEquipment();

    if(shouldAutoSell(e)){

      const gain=sellGain(e);

      player.upgradeStone+=gain.upgrade;
      player.awakeStone+=gain.awake;

      up+=gain.upgrade;
      aw+=gain.awake;

      sold++;
    }

    else{

      player.equipments.push(e);

      if(result.length<20){

        result.push(
          `<span style="color:${rarityColors[e.rarity]}">${e.rarity}</span> `+
          `${slotName(e.slot)} ${e.name}`
        );
      }
    }

    player.gachaExp++;

    while(player.gachaExp>=needGachaExp()){

      player.gachaExp-=needGachaExp();

      player.gachaLv++;

      showEffect("ガチャLvUP");
    }
  }

  document.getElementById("gachaResult").innerHTML=
    `表示：${result.length}件<br>`+
    result.join("<br>")+
    `<br>自動売却：${sold}個`+
    `<br>強化素材+${up} 覚醒素材+${aw}`;

  saveGame();

  drawAll();
}
