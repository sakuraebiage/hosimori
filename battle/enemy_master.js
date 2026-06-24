// ========================================
// 星守戦線 敵マスターデータ
// ========================================

// ---------- 二つ名 ----------
const titles = {

  "終焉の": {
    hp: 500,
    attack: 100
  },

  "奈落の": {
    hp: 300,
    attack: 50
  },

  "災厄の": {
    hp: 200,
    attack: 150
  },

  "深淵の": {
    defense: 100
  }

};

// ---------- 特性 ----------
const traits = {

  "暴走": {
    attack: 100,
    speed: 50
  },

  "巨大": {
    hp: 500,
    defense: 50,
    speed: -20
  },

  "高速": {
    speed: 150
  },

  "堅牢": {
    defense: 100
  }

};

// ---------- 属性 ----------
const elements = {

  "炎": {
    attack: 50,
    attributes: ["炎"]
  },

  "氷": {
    defense: 50,
    attributes: ["氷"]
  },

  "雷": {
    speed: 50,
    attributes: ["雷"]
  },

  "侵食": {
    hp: 100,
    attributes: ["侵食"]
  },

  "冥": {
    mp: 100,
    attributes: ["闇", "アンデッド"]
  }

};

// ---------- 種族 ----------
const races = {

  "狼": {
    hp: 100,
    attack: 50,
    defense: 20,
    speed: 80,

    attributes: ["獣"]
  },

  "騎士": {
    hp: 300,
    attack: 100,
    defense: 100,
    speed: 30,

    attributes: ["人型"]
  },

  "兵士": {
    hp: 180,
    attack: 80,
    defense: 60,
    speed: 60,

    attributes: ["人型"]
  },

  "竜": {
    hp: 1000,
    attack: 300,
    defense: 200,
    speed: 50,

    attributes: ["竜"]
  }

};

// ========================================
// ランダム取得
// ========================================

function randomKey(obj){

  const keys = Object.keys(obj);

  return keys[
    Math.floor(
      Math.random() * keys.length
    )
  ];

}

// ========================================
// 敵生成
// ========================================

function generateEnemy(){

  const title = randomKey(titles);
  const trait = randomKey(traits);
  const element = randomKey(elements);
  const race = randomKey(races);

  const t = titles[title];
  const tr = traits[trait];
  const e = elements[element];
  const r = races[race];
  console.log(generateEnemy());

  return {

    id: crypto.randomUUID(),

    name:
      title +
      trait +
      element +
      race,

    hp:
      (t.hp || 0) +
      (tr.hp || 0) +
      (e.hp || 0) +
      (r.hp || 0),
      
      sp:
  (t.sp || 0) +
  (tr.sp || 0) +
  (e.sp || 0) +
  (r.sp || 0),

    mp:
      (t.mp || 0) +
      (tr.mp || 0) +
      (e.mp || 0) +
      (r.mp || 0),

    attack:
      (t.attack || 0) +
      (tr.attack || 0) +
      (e.attack || 0) +
      (r.attack || 0),

    defense:
      (t.defense || 0) +
      (tr.defense || 0) +
      (e.defense || 0) +
      (r.defense || 0),

    speed:
      (t.speed || 0) +
      (tr.speed || 0) +
      (e.speed || 0) +
      (r.speed || 0),

    attributes: [

      ...(e.attributes || []),

      ...(r.attributes || [])

    ]

  };

}

// ========================================
// テスト
// ========================================

for(let i=0;i<10;i++){

}
