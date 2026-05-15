function setText(id,value){

  const el=document.getElementById(id);

  if(el){
    el.textContent=value;
  }
}

function setHTML(id,value){

  const el=document.getElementById(id);

  if(el){
    el.innerHTML=value;
  }
}

function drawBattle(){

  setText("dungeonName",dungeonName());
  setText("floorText",player.floor+"F");
  setText("enemyName",enemy.name);
  setText("enemyAtk",enemy.atk);
  setText("enemyHpText",enemy.hp+" / "+enemy.maxHp);

  const bar=document.getElementById("enemyHpFill");

  if(bar){
    bar.style.width=
      (enemy.hp/enemy.maxHp*100)+"%";
  }
}

function drawStatus(){

  calcStats();

  setHTML("statusArea",`

<div class="statLine">
<span>Lv</span>
<span>${player.level}</span>
</div>

<div class="statLine">
<span>HP</span>
<span>${Math.floor(player.hp)} / ${player.maxHp}</span>
</div>

<div class="statLine">
<span>攻撃</span>
<span>${player.atk}</span>
</div>

<div class="statLine">
<span>防御</span>
<span>${player.def}</span>
</div>

<div class="statLine">
<span>EXP</span>
<span>${Math.floor(player.exp)} / ${needExp()}</span>
</div>

<div class="statLine">
<span>ゴールド</span>
<span>${Math.floor(player.gold)}</span>
</div>

<div class="statLine">
<span>ガチャ</span>
<span>${player.gachaStone}</span>
</div>

<div class="statLine">
<span>強化素材</span>
<span>${player.upgradeStone}</span>
</div>

<div class="statLine">
<span>覚醒素材</span>
<span>${player.awakeStone}</span>
</div>

<hr>

<div class="statLine">
<span>経験値UP</span>
<span>+${bonus.exp}%</span>
</div>

<div class="statLine">
<span>ゴールドUP</span>
<span>+${bonus.gold}%</span>
</div>

<div class="statLine">
<span>ガチャ率</span>
<span>${Math.min(100,20+bonus.gacha)}%</span>
</div>

<div class="statLine">
<span>強化素材率</span>
<span>${Math.min(100,50+bonus.upgrade)}%</span>
</div>

<div class="statLine">
<span>覚醒素材率</span>
<span>${Math.min(100,25+bonus.awake)}%</span>
</div>

<div class="statLine">
<span>ゲーム速度</span>
<span>+${bonus.speed}%</span>
</div>

<div class="statLine">
<span>連撃率</span>
<span>${bonus.multi}%</span>
</div>

<div class="statLine">
<span>階層スキップ</span>
<span>${Math.floor(bonus.skip/100)}</span>
</div>
`);
}

function drawSlotButtons(){

  let html=`
<button
class="${
equipFilter==="all"
?
"activeSlot"
:
""
}"
onclick="setEquipFilter('all')">
全部
</button>
`;

  for(const [slot,label] of slots){

    const equippedId=
      player.equipped[slot];

    const mark=
      equippedId
      ?
      "★"
      :
      "";

    html+=`
<button
class="${
equipFilter===slot
?
"activeSlot"
:
""
}"
onclick="setEquipFilter('${slot}')">
${mark}${label}
</button>
`;
  }

  setHTML("slotButtons",html);
}

function drawBulkSellButtons(){

  let html="";

  for(const r of unlockedRarities()){

    html+=`
<button onclick="sellAll('${r}')">
${r}以下売却
</button>
`;
  }

  setHTML("bulkSellButtons",html);
}

function drawAutoSell(){

  let html=`
<option value="off">
OFF
</option>
`;

  for(const r of unlockedRarities()){

    html+=`
<option value="${r}" ${player.autoSell===r?"selected":""}>
${r}以下
</option>
`;
  }

  setHTML("autoSellSelect",html);

  const el=document.getElementById("autoSellSelect");

  if(el){
    el.value=player.autoSell;
  }
}

function drawEquip(){

  drawSlotButtons();
  drawBulkSellButtons();
  drawAutoSell();

  let html="";

  const list=sortedEquipments();

  if(list.length===0){

    setHTML(
      "equipList",
      `<div class="item">装備なし</div>`
    );

    return;
  }

  for(const {e,i} of list){

    const equipped=
      player.equipped[e.slot]===e.id;

    html+=`

<div class="item ${
equipped
?
"equipped"
:
""
}">

${
equipped
?
'<div style="color:gold;font-weight:bold;">【装備中】</div>'
:
""
}

<span style="
color:${rarityColors[e.rarity]};
font-weight:bold;
">
${e.rarity}
</span>

${slotName(e.slot)}
${e.name}

<br>

攻撃 +${equipFinal(e,"atk")}
防御 +${equipFinal(e,"def")}
HP +${equipFinal(e,"hp")}

<br>

品質 ${e.quality}%
強化 +${e.upgrade}/${equipLimit(e)}
覚醒 +${e.awake}

<br>

OP：
${e.op1}
/
${e.op2}
/
${e.op3}

<br>

<button onclick="equipItem(${i})">
装備
</button>

<button onclick="upgradeEquip(${i},1)">
+1
</button>

<button onclick="upgradeEquip(${i},10)">
+10
</button>

<button onclick="upgradeEquip(${i},100)">
+100
</button>

<button onclick="upgradeEquipMax(${i})">
最大
</button>

<button onclick="awakeEquip(${i})">
覚醒
</button>

<button onclick="sellEquip(${i})">
売却
</button>

</div>
`;
  }

  setHTML("equipList",html);
}

function drawPlayerUpgrade(){

  setText("pointText",player.point);

  setHTML("pointArea",`

<div class="item">
<b>HP強化</b>
<br>
<button onclick="addStat('hp',1)">+1</button>
<button onclick="addStat('hp',10)">+10</button>
<button onclick="addStat('hp',100)">+100</button>
<button onclick="addStatMax('hp')">最大</button>
</div>

<div class="item">
<b>攻撃強化</b>
<br>
<button onclick="addStat('atk',1)">+1</button>
<button onclick="addStat('atk',10)">+10</button>
<button onclick="addStat('atk',100)">+100</button>
<button onclick="addStatMax('atk')">最大</button>
</div>

<div class="item">
<b>防御強化</b>
<br>
<button onclick="addStat('def',1)">+1</button>
<button onclick="addStat('def',10)">+10</button>
<button onclick="addStat('def',100)">+100</button>
<button onclick="addStatMax('def')">最大</button>
</div>
`);

  setHTML("goldUpgradeArea",`

<div class="item">
<b>攻撃倍率</b>
<br>
Lv ${player.goldAtkLv}
<br>
<button onclick="goldUpgrade('atk',1)">+1</button>
<button onclick="goldUpgrade('atk',10)">+10</button>
<button onclick="goldUpgrade('atk',100)">+100</button>
<button onclick="goldUpgradeMax('atk')">最大</button>
</div>

<div class="item">
<b>防御倍率</b>
<br>
Lv ${player.goldDefLv}
<br>
<button onclick="goldUpgrade('def',1)">+1</button>
<button onclick="goldUpgrade('def',10)">+10</button>
<button onclick="goldUpgrade('def',100)">+100</button>
<button onclick="goldUpgradeMax('def')">最大</button>
</div>
`);
}

function drawGachaUI(){

  setText("gachaLv",player.gachaLv);
  setText("gachaExp",player.gachaExp);
  setText("needGachaExp",needGachaExp());
  setText("gachaStoneText",player.gachaStone);

  const rates=getRates();

  setHTML(
    "rateArea",
    rarityOrder
      .filter(r=>rates[r]>0)
      .map(r=>
        `<span style="color:${rarityColors[r]}">${r}</span>：${rates[r].toFixed(2)}%`
      )
      .join("<br>")
  );
}

function drawDungeon(){

  setText("currentDungeon",dungeonName());
  setText("dungeonKey",player.dungeonKey);
}

function drawAll(){

  drawBattle();
  drawStatus();
  drawEquip();
  drawPlayerUpgrade();
  drawGachaUI();
  drawDungeon();
}

function openTab(id,btn){

  currentTab=id;

  document
    .querySelectorAll("section")
    .forEach(s=>s.classList.add("hidden"));

  document
    .getElementById(id)
    .classList.remove("hidden");

  document
    .querySelectorAll(".tab")
    .forEach(t=>t.classList.remove("activeTab"));

  btn.classList.add("activeTab");

  drawAll();
}

function setBattleLog(text){

  setHTML("battleLog",text);
}

function addBattleLog(text){

  const el=document.getElementById("battleLog");

  if(el){
    el.innerHTML+="<br>"+text;
  }
}

function showEffect(text){

  const div=document.createElement("div");

  div.className="effect";
  div.textContent=text;

  document.body.appendChild(div);

  setTimeout(()=>{
    div.remove();
  },1000);
}
