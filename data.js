const slots=[
  ["weapon","武器"],
  ["head","頭"],
  ["armor","鎧"],
  ["pants","ズボン"],
  ["shoes","靴"],
  ["gloves","手袋"],
  ["wing","羽"],
  ["necklace","ネックレス"],
  ["bracelet","腕輪"],
  ["pet","ペット"]
];

const rarityOrder=[
  "N","R","HR","SR","SSR",
  "UR","LR","MR","GR","EX",
  "Z","ZZ","ZZZ","Ω",
  "神","超神","創世","終焉","虚無"
];

const rarityColors={
  N:"#aaa",
  R:"#4caf50",
  HR:"#03a9f4",
  SR:"#9c27b0",
  SSR:"#ffd700",
  UR:"#ff4444",
  LR:"#ff00ff",
  MR:"#ff8800",
  GR:"#fff",
  EX:"#00ffff",
  Z:"#66ffcc",
  ZZ:"#66ccff",
  ZZZ:"#cc66ff",
  "Ω":"#ff66cc",
  "神":"#ffff66",
  "超神":"#ffcc00",
  "創世":"#00ff99",
  "終焉":"#9999ff",
  "虚無":"#ddd"
};

function dungeonName(){
  return {
    normal:"通常",
    gold:"ゴールドD",
    upgrade:"強化素材D",
    awake:"覚醒素材D",
    gacha:"ガチャD"
  }[player.dungeon];
}

function enemyName(){
  const list=[
    "スライム",
    "ゴブリン",
    "ウルフ",
    "スケルトン",
    "魔獣",
    "ドラゴン"
  ];

  return list[player.floor % list.length];
}

function equipName(slot){
  return {
    weapon:"剣",
    head:"兜",
    armor:"鎧",
    pants:"ズボン",
    shoes:"靴",
    gloves:"手袋",
    wing:"羽",
    necklace:"ネックレス",
    bracelet:"腕輪",
    pet:"ペット"
  }[slot];
}

function slotName(slot){
  return slots.find(s=>s[0]===slot)[1];
}
