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

function gacha(count){

  let results=[];
  let rareResults=[];

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

      let gain=sellGain(e);

      player.upgradeStone+=gain.up;
      player.awakeStone+=gain.aw;

      gainUp+=gain.up;
      gainAw+=gain.aw;

      sold++;
    }

    else{

      player.equipments.push(e);

      let txt=
        `<span style="color:${rarityColors[e.rarity]}">`+
        `${e.rarity}</span> `+
        `${slotName(e.slot)} ${e.name}`;

      results.push(txt);

      if(
        rarityIndex(e.rarity)>=rarityIndex("SSR")
      ){
        rareResults.push(txt);
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

  let text="";

  if(count>=100){

    text=
      `100連結果：入手${results.length}個 / 自動売却${sold}個`;

    if(sold>0){
      text+=
        `<br>売却獲得：強化+${gainUp} 覚醒+${gainAw}`;
    }

    text+=
      `<br>SSR以上：<br>`+
      (
        rareResults.join("<br>")||
        "なし"
      );
  }

  else{

    text=
      results.join("<br")||
      "全て自動売却 or ガチャアイテム不足";

    if(sold>0){
      text+=
        `<br>自動売却${sold}個：強化+${gainUp} 覚醒+${gainAw}`;
    }
  }

  document.getElementById("gachaResult")
    .innerHTML=text;

  saveGame();
  drawCommon();

  if(activeTab==="equipTab"){
    renderEquipList();
  }
}

function shouldAutoSell(e){
