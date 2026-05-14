function safeSet(id,value){
  const el=document.getElementById(id);
  if(el) el.textContent=value;
}

function safeHTML(id,value){
  const el=document.getElementById(id);
  if(el) el.innerHTML=value;
}

function drawSlotButtons(){

  const el=document.getElementById("slotButtons");
  if(!el)return;

  let html=`
<button class="slotBtn ${equipFilter==="all"?"activeSlot":""}"
onclick="setEquipFilter('all')">
全部
</button>`;

  for(const [slot,label] of slots){

    let idx=player.equipped[slot];

    let mark=
      idx!==null &&
      player.equipments[idx]
      ?
      "★"
      :
      "";

    html+=`
<button
class="slotBtn ${equipFilter===slot?"activeSlot":""}"
onclick="setEquipFilter('${slot}')">
${mark}${label}
</button>`;
  }

  el.innerHTML=html;
}

function drawBulkSellButtons(){

  const el=document.getElementById("bulkSellButtons");
  if(!el)return;

  let html="";

  for(const r of unlockedRarities()){
    html+=`
<button onclick="sellAll('${r}')">
${r}以下売却
</button>`;
  }

  el.innerHTML=html;
}

function drawAutoSellSelect(){

  const el=document.getElementById("autoSellSelect");
  if(!el)return;

  let options=`<option value="off">OFF</option>`;

  for(const r of unlockedRarities()){
    options+=`
<option value="${r}" ${player.autoSellRank===r?"selected":""}>
${r}以下
</option>`;
  }

  el.innerHTML=options;
  el.value=player.autoSellRank||"off";
}

function drawBattle(){

  safeSet("dungeonName",dungeonName());
  safeSet("floor",player.floor+"F");
  safeSet("enemyName",enemy.name||"");
  safeSet("enemyAtk",enemy.atk||"");
  safeSet("enemyHpText",(enemy.hp||0)+" / "+(enemy.maxHp||0));

  const fill=document.getElementById("enemyHpFill");
  if(fill && enemy.maxHp){
    fill.style.width=(enemy.hp/enemy.maxHp*100)+"%";
  }
}

function drawCommon(){

  calcStats();

  safeHTML("statusList",`
<div class="statLine"><span>Lv</span><span>${player.level}</span></div>
<div class="statLine"><span>HP</span><span>${Math.floor(player.hp)} / ${player.maxHp}</span></div>
<div class="statLine"><span>攻撃</span><span>${player.atk}</span></div>
<div class="statLine"><span>防御</span><span>${player.def}</span></div>
<div class="statLine"><span>EXP</span><span>${Math.floor(player.exp)} / ${needExp()}</span></div>
<div class="statLine"><span>ゴールド</span><span>${Math.floor(player.gold)}</span></div>
<div class="statLine"><span>ガチャアイテム</span><span>${player.gachaStone}</span></div>
<div class="statLine"><span>強化素材</span><span>${player.upgradeStone}</span></div>
<div class="statLine"><span>覚醒素材</span><span>${player.awakeStone}</span></div>

<hr>

<div class="statLine"><span>経験値UP</span><span>+${bonus.exp}%</span></div>
<div class="statLine"><span>ゴールドUP</span><span>+${bonus.gold}%</span></div>
<div class="statLine"><span>ガチャ率</span><span>${Math.min(100,20+bonus.gacha)}%</span></div>
<div class="statLine"><span>強化素材率</span><span>${Math.min(100,50+bonus.upgrade)}%</span></div>
<div class="statLine"><span>覚醒素材率</span><span>${Math.min(100,25+bonus.awake)}%</span></div>
<div class="statLine"><span>ゲーム速度</span><span>+${bonus.speed}%</span></div>
<div class="statLine"><span>連撃率</span><span>${bonus.multi}%</span></div>
<div class="statLine"><span>階層スキップ</span><span>${Math.floor(bonus.skip/100)}</span></div>
`);

  safeSet("point",player.point);

  safeSet("hpPointInfo","次上昇："+statAddValue("hp"));
  safeSet("atkPointInfo","次上昇："+statAddValue("atk"));
  safeSet("defPointInfo","次上昇："+statAddValue("def"));

  safeSet("goldAtkLv",player.goldAtkLv);
  safeSet("goldDefLv",player.goldDefLv);
  safeSet("goldAtkBonus",player.goldAtkLv*10);
  safeSet("goldDefBonus",player.goldDefLv*10);
  safeSet("goldAtkCost",goldCost(player.goldAtkLv));
  safeSet("goldDefCost",goldCost(player.goldDefLv));

  safeSet("gachaLv",player.gachaLv);
  safeSet("gachaExp",player.gachaExp);
  safeSet("needGachaExp",needGachaExp());
  safeSet("gachaStone2",player.gachaStone);

  safeSet("currentDungeon",dungeonName());
  safeSet("dungeonKey",player.dungeonKey);

  let rates=getRates();

  safeHTML(
    "rateText",
    rarityOrder
    .filter(r=>rates[r]>0)
    .map(r=>`<span style="color:${rarityColors[r]}">${r}</span>：${rates[r].toFixed(2)}%`)
    .join("<br>")
  );

  drawSlotButtons();
  drawBulkSellButtons();
  drawAutoSellSelect();
}

function renderEquipList(){

  drawSlotButtons();
  drawBulkSellButtons();
  drawAutoSellSelect();

  const el=document.getElementById("equipList");
  if(!el)return;

  let list=sortedEquipments();

  if(list.length===0){
    el.innerHTML=`<div class="item">この部位の装備なし</div>`;
    return;
  }

  let html="";

  for(let v of list){

    let e=v.e;
    let i=v.i;

    let eq=isEquipped(i);
    let lim=upgradeLimit(e);

    html+=`
<div class="item ${eq?"equipped":""}">

${eq?"【装備中】 ":""}
<span style="color:${rarityColors[e.rarity]};font-weight:bold;">
${e.rarity}
</span>
${slotName(e.slot)} ${e.name}

<br>

攻撃 +${finalEquipPower(e,"atk")}
防御 +${finalEquipPower(e,"def")}
HP +${finalEquipPower(e,"hp")}

<br>

品質${e.quality}%
強化 +${e.upgrade}/${lim}
覚醒 +${e.awake}

<br>

OP：
${e.option1} /
${e.option2} /
${e.option3}

<br>

<button onclick="equipItem(${i})">装備</button>
<button onclick="upgradeItem(${i},1)">+1</button>
<button onclick="upgradeItem(${i},10)">+10</button>
<button onclick="upgradeItem(${i},100)">+100</button>
<button onclick="upgradeMax(${i})">最大</button>
<button onclick="awakeItem(${i})">覚醒</button>
<button onclick="sellEquip(${i})">売却</button>

</div>`;
  }

  el.innerHTML=html;
}

function showTab(id,btn){

  activeTab=id;

  document
    .querySelectorAll("#battleTab,#equipTab,#playerTab,#gachaTab,#dungeonTab")
    .forEach(e=>e.classList.add("hidden"));

  const target=document.getElementById(id);
  if(target)target.classList.remove("hidden");

  document
    .querySelectorAll(".tab")
    .forEach(e=>e.classList.remove("active"));

  if(btn)btn.classList.add("active");

  drawCommon();

  if(id==="equipTab"){
    renderEquipList();
  }
}

function battleLog(t){
  safeHTML("battleLog",t);
}

function battleLogAdd(t){
  const el=document.getElementById("battleLog");
  if(el)el.innerHTML+="<br>"+t;
}

function showEffect(t){

  let d=document.createElement("div");

  d.className="effect";
  d.textContent=t;

  document.body.appendChild(d);

  setTimeout(()=>{
    d.remove();
  },1000);
}
