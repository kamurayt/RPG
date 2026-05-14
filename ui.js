function renderEquipList(){

  drawSlotButtons();
  drawBulkSellButtons();
  drawAutoSellSelect();

  let list=sortedEquipments();

  let html="";

  if(list.length===0){

    html=`
<div class="item">
装備なし
</div>
`;

    document.getElementById(
      "equipList"
    ).innerHTML=html;

    return;
  }

  for(let v of list){

    let e=v.e;
    let i=v.i;

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

<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:6px;
">

<div>

${
eq
?
"【装備中】"
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

</div>

<div>
品質${e.quality}%
</div>

</div>

<div>

攻撃 +${finalEquipPower(e,"atk")}
<br>

防御 +${finalEquipPower(e,"def")}
<br>

HP +${finalEquipPower(e,"hp")}

</div>

<hr>

<div>

強化 +${e.upgrade}/${lim}
<br>

覚醒 +${e.awake}

</div>

<hr>

<div style="
font-size:12px;
line-height:1.6;
">

${e.option1}
<br>

${e.option2}
<br>

${e.option3}

</div>

<hr>

<div>

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

<button onclick="awakeItem(${i})">
覚醒
</button>

<button onclick="sellEquip(${i})">
売却
</button>

</div>

</div>
`;
  }

  document.getElementById(
    "equipList"
  ).innerHTML=html;
}
