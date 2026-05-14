function drawSlotButtons(){

  let html=
    `<button class="slotBtn ${
      equipFilter==="all"
      ?
      "activeSlot"
      :
      ""
    }"
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
class="slotBtn ${
equipFilter===slot
?
"activeSlot"
:
""
}"
onclick="setEquipFilter('${slot}')"
>
${mark}${label}
</button>`;
  }

  document.getElementById(
    "slotButtons"
  ).innerHTML=html;
}

function drawBulkSellButtons(){

  let html="";

  for(const r of unlockedRarities()){

    html+=`
<button onclick="sellAll('${r}')">
${r}以下売却
</button>`;
  }

  document.getElementById(
    "bulkSellButtons"
  ).innerHTML=html;
}

function drawAutoSellSelect(){

  let options=
    `<option value="off">OFF</option>`;

  for(const r of unlockedRarities()){

    options+=`
<option
value="${r}"
${
player.autoSellRank===r
?
"selected"
:
""
}
>
${r}以下
</option>`;
  }

  document.getElementById(
    "autoSellSelect"
  ).innerHTML=options;

  document.getElementById(
    "autoSellSelect"
  ).value=
    player.autoSellRank||"off";
}

function drawBattle(){

  document.getElementById(
    "dungeonName"
  ).textContent=dungeonName();

  document.getElementById(
    "floor"
  ).textContent=
    player.floor+"F";

  document.getElementById(
    "enemyName"
  ).textContent=enemy.name;

  document.getElementById(
    "enemyAtk"
  ).textContent=enemy.atk;

  document.getElementById(
    "enemyHpText"
  ).textContent=
    enemy.hp+
    " / "+
    enemy.maxHp;

  document.getElementById(
    "enemyHpFill"
  ).style.width=
    (
      enemy.hp/
      enemy.maxHp*
      100
    )+"%";
}

function drawCommon(){

  calcStats();

  document.getElementById(
    "statusList"
  ).innerHTML=`

<div class="statLine">
<span>Lv</span>
<span>${player.level}</span>
</div>

<div class="statLine">
<span>HP</span>
<span>
${Math.floor(player.hp)}
/
${player.maxHp}
</span>
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
<span>
${Math.floor(player.exp)}
/
${needExp()}
</span>
</div>

<div class="statLine">
<span>ゴールド</span>
<span>${Math.floor(player.gold)}</span>
</div>

<div class="statLine">
<span>ガチャアイテム</span>
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
<span>
${Math.min(
100,
20+bonus.gacha
)}%
</span>
</div>

<div class="statLine">
<span>強化素材率</span>
<span>
${Math.min(
100,
50+bonus.upgrade
)}%
</span>
</div>

<div class="statLine">
<span>覚醒素材率</span>
<span>
${Math.min(
100,
25+bonus.awake
)}%
</span>
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
<span>
${Math.floor(
bonus.skip/100
)}
</span>
</div>
`;

  document.getElementById(
    "point"
  ).textContent=player.point;

  document.getElementById(
    "gachaLv"
  ).textContent=player.gachaLv;

  document.getElementById(
    "gachaExp"
  ).textContent=player.gachaExp;

  document.getElementById(
    "needGachaExp"
  ).textContent=needGachaExp();

  document.getElementById(
    "gachaStone2"
  ).textContent=player.gachaStone;

  document.getElementById(
    "currentDungeon"
  ).textContent=dungeonName();

  document.getElementById(
    "dungeonKey"
  ).textContent=player.dungeonKey;

  let rates=getRates();

  document.getElementById(
    "rateText"
  ).innerHTML=
    rarityOrder
    .filter(r=>rates[r]>0)
    .map(r=>
      `<span style="color:${rarityColors[r]}">
      ${r}
      </span>
      ：
      ${rates[r].toFixed(2)}%`
    )
    .join("<br>");

  drawSlotButtons();
  drawBulkSellButtons();
  drawAutoSellSelect();
}

function renderEquipList(){

  drawSlotButtons();

  let html="";

  sortedEquipments().forEach(({e,i})=>{

    let eq=isEquipped(i);

    let lim=upgradeLimit(e);

    html+=`

<div class="item ${
eq
?
"equipped"
:
""
}">

${
eq
?
"【装備中】 "
:
""
}

<span
style="
color:${rarityColors[e.rarity]};
font-weight:bold;
"
>
${e.rarity}
</span>

${slotName(e.slot)}
${e.name}

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
${e.option1}
/
${e.option2}
/
${e.option3}

<br>

<button onclick="equipItem(${i})">
装備
</button>

<button onclick="upgradeItem(${i},1)">
+1
</button>

<button onclick="upgradeItem(${i},10)">
+10
</button>

<button onclick="upgradeItem(${i},100)">
+100
</button>

<button onclick="upgradeMax(${i})">
最大
</button>

<button onclick="sellEquip(${i})">
売却
</button>

</div>`;
  });

  document.getElementById(
    "equipList"
  ).innerHTML=
    html||
    "この部位の装備なし";
}

function showTab(id,btn){

  activeTab=id;

  document
    .querySelectorAll(
      "#battleTab,#equipTab,#playerTab,#gachaTab,#dungeonTab"
    )
    .forEach(e=>
      e.classList.add("hidden")
    );

  document
    .getElementById(id)
    .classList.remove("hidden");

  document
    .querySelectorAll(".tab")
    .forEach(e=>
      e.classList.remove("active")
    );

  btn.classList.add("active");

  drawCommon();

  if(id==="equipTab"){
    renderEquipList();
  }
}

function battleLog(t){
  document.getElementById(
    "battleLog"
  ).innerHTML=t;
}

function battleLogAdd(t){
  document.getElementById(
    "battleLog"
  ).innerHTML+="<br>"+t;
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
