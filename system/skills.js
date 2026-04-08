// ===============================
// 🔷 バージョン管理（超重要）
// ===============================
const SKILL_VERSION = "2.0";

// ===============================
// 🔷 属性
// ===============================
const elements = ["無","火","水","雷","氷","風","土","光","闇"];

// ===============================
// 🔷 名前素材
// ===============================
const nameParts = {
  prefix:["紅蓮","蒼","雷鳴","氷牙","疾風","影","剛","烈"],
  physical:["斬","撃","突","断","砕","連斬","崩し"],
  magic:["波","弾","術","爆","嵐","陣","閃"],
  suffix:["改","式","破","極","零","真"]
};

const buffNames = ["加護","守護","祝福","強化"];
const healNames = ["癒し","治癒","再生"];

// ===============================
// 🔷 レア度
// ===============================
function getRarity(total){
  if(total > 200) return 5;
  if(total > 120) return 4;
  if(total > 60) return 3;
  return 2;
}

// ===============================
// 🔷 カテゴリ
// ===============================
function getSkillCategory(i){
  if(i >= 300 && Math.random() < 0.2) return "authority";

  const r = Math.random();
  if(r < 0.6) return "attack";
  if(r < 0.85) return "buff";
  return "heal";
}

// ===============================
// 🔷 名前生成
// ===============================
function generateSkillName(category, main, element, rarity){

  if(category==="buff"){
    return `${element}の${buffNames[Math.floor(Math.random()*buffNames.length)]}`;
  }

  if(category==="heal"){
    return `${element}の${healNames[Math.floor(Math.random()*healNames.length)]}`;
  }

  if(category==="authority"){
    return `${element}の覚醒`;
  }

  const p = nameParts.prefix[Math.floor(Math.random()*nameParts.prefix.length)];
  const core = main==="物理"
    ? nameParts.physical[Math.floor(Math.random()*nameParts.physical.length)]
    : nameParts.magic[Math.floor(Math.random()*nameParts.magic.length)];

  const s = rarity>=4
    ? nameParts.suffix[Math.floor(Math.random()*nameParts.suffix.length)]
    : "";

  return `${element}${p}${core}${s}`;
}

// ===============================
// 🔷 効果生成
// ===============================
function createEffect(category){

  if(category==="attack") return {type:"damage"};

  if(category==="buff"){
    const list = [
      {type:"atkUp", value:20},
      {type:"defUp", value:20},
      {type:"spdUp", value:10},
      {type:"critUp", value:15}
    ];
    return list[Math.floor(Math.random()*list.length)];
  }

  if(category==="heal") return {type:"heal"};

  if(category==="authority"){
    const list = [
      {type:"allUp"},
      {type:"invincible"},
      {type:"extraTurn"}
    ];
    return list[Math.floor(Math.random()*list.length)];
  }

  return null;
}

// ===============================
// 🔷 スキル生成
// ===============================
function generateSkill(i){

  const t = getTotalStats();
  const total = getTotalPower();
  const rarity = getRarity(total);

  const category = getSkillCategory(i);
  const main = t.physical > t.magic ? "物理" : "魔法";
  const element = elements[Math.floor(Math.random()*elements.length)];

  let power = 0;
  let hits = 1;
  let target = "単体";

  const variance = (Math.random()*0.4 - 0.2);

  if(category==="attack"){
    power = Number((1 + total*0.002 + rarity*0.3 + variance).toFixed(2));
    hits = rarity>=4 ? Math.floor(Math.random()*3)+2 : 1;
    target = rarity>=3 && Math.random()>0.5 ? "全体" : "単体";
  }

  if(category==="heal"){
    power = Number((total*0.01 + rarity*2).toFixed(2));
    target = "味方単体";
  }

  if(category==="buff"){
    target = "味方全体";
  }

  if(category==="authority"){
    target = "自分";
  }

  const cost = {
    sp: main==="物理" ? Math.floor(power*5) : 0,
    mp: main==="魔法" ? Math.floor(power*5) : 0
  };

  return {
    id:"g"+i,
    name: generateSkillName(category, main, element, rarity),
    power,
    hits,
    target,
    type:main,
    element,
    category,
    rarity,
    cost,
    effectData:createEffect(category),
    isCustom:true
  };
}

// ===============================
// 🔷 キャッシュ管理（ここが神）
// ===============================
function getGeneratedSkills(){

  const savedVersion = localStorage.getItem("skillVersion");

  // バージョン違ったらリセット
  if(savedVersion !== SKILL_VERSION){
    localStorage.removeItem("genSkills");
    localStorage.setItem("skillVersion", SKILL_VERSION);
  }

  let data = JSON.parse(localStorage.getItem("genSkills"));

  if(!data){
    data=[];
    for(let i=0;i<50;i++){
      data.push(generateSkill(i));
    }
    localStorage.setItem("genSkills", JSON.stringify(data));
  }

  return data;
}

// ===============================
// 🔷 固定スキル
// ===============================
const skillMaster = [
  {id:"s1",name:"星裂斬",power:1.2,hits:1,target:"単体",type:"物理",element:"無",category:"attack",cost:{sp:5,mp:0},effectData:{type:"damage"},isCustom:false},
  {id:"s2",name:"蒼流波",power:1.0,hits:1,target:"全体",type:"魔法",element:"水",category:"attack",cost:{sp:0,mp:8},effectData:{type:"damage"},isCustom:false}
];

// ===============================
// 🔷 全取得
// ===============================
function getAllSkills(){
  return [...skillMaster, ...getGeneratedSkills()];
}