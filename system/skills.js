// ===============================
// 🔷 バージョン管理
// ===============================
const SKILL_VERSION = "4.2";

// ===============================
// 🔷 安全ガード
// ===============================
if(typeof getTotalStats !== "function"){
  window.getTotalStats = function(){
    return {
      physical:10, magic:10, vitality:10,
      endurance:10, agility:10, spirit:10, luck:10
    };
  };
}

if(typeof getTotalPower !== "function"){
  window.getTotalPower = function(){
    const t = getTotalStats();
    return Object.values(t).reduce((a,b)=>a+b,0);
  };
}

// ===============================
// 🔷 属性
// ===============================
const elements = ["無","火","水","雷","氷","風","土","光","闇"];

// ===============================
// 🔷 属性別バフ（重要）
// ===============================
const elementBuffMap = {
  無: ["normalAtkUp","counter","preStrike"],
  火: ["burnBoost","atkUp"],
  水: ["regen","healBoost"],
  雷: ["speedUp","multiHitBoost"],
  氷: ["freezeBoost","defUp"],
  風: ["speedUp","evasion"],
  土: ["defUp","damageCut"],
  光: ["healBoost","revive"],
  闇: ["drain","critUp"]
};

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
// 🔷 コンボ
// ===============================
function createComboEffect(rarity){
  const list = [];

  if(Math.random()<0.4){
    list.push({ type:"bonusVsStatus", value:20 + rarity*10 });
  }

  if(Math.random()<0.3){
    list.push({ type:"bonusPerDebuff", value:10 });
  }

  if(Math.random()<0.2){
    list.push({ type:"critIfFrozen" });
  }

  return list;
}

// ===============================
// 🔷 カテゴリ
// ===============================
function getSkillCategory(){
  const r = Math.random();
  if(r < 0.35) return "attack";
  if(r < 0.65) return "debuff";
  if(r < 0.9) return "buff";
  return "heal";
}

// ===============================
// 🔷 ターゲット
// ===============================
function getTarget(category){

  if(category==="buff" || category==="heal"){
    return Math.random()<0.5 ? "味方単体" : "味方全体";
  }

  const list = ["単体","2体","3体","前列","後列","敵全体"];
  return list[Math.floor(Math.random()*list.length)];
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
// 🔷 デバフ＋状態異常
// ===============================
function createDebuffEffect(rarity){

  const list = [];
  const pool = ["atkDown","defDown","spdDown","critDown","poison","burn","freeze"];

  const count = 1 + Math.floor(rarity/3);

  for(let i=0;i<count;i++){

    const type = pool[Math.floor(Math.random()*pool.length)];

    list.push({
      type,
      value:10+rarity*5,
      duration:2+Math.floor(rarity/2),
      chance:60
    });
  }

  return list;
}

// ===============================
// 🔷 バフ生成（属性連動🔥）
// ===============================
function createBuffEffect(rarity, element){

  const buffs = [];
  const pool = elementBuffMap[element] || [];

  const count = 1 + Math.floor(rarity/3);

  for(let i=0;i<count;i++){

    const type = pool[Math.floor(Math.random()*pool.length)];

    switch(type){

      case "normalAtkUp":
        buffs.push({type:"normalAtkUp", value:20+rarity*10, duration:3});
        break;

      case "counter":
        buffs.push({type:"counter", chance:30+rarity*5, duration:2});
        break;

      case "preStrike":
        buffs.push({type:"preStrike", chance:30+rarity*5, duration:2});
        break;

      case "regen":
        buffs.push({type:"regen", value:5+rarity*3, duration:3});
        break;

      case "speedUp":
        buffs.push({type:"speedUp", value:10+rarity*5, duration:2});
        break;

      case "healBoost":
        buffs.push({type:"healBoost", value:15+rarity*5, duration:3});
        break;

      case "atkUp":
        buffs.push({type:"atkUp", value:15+rarity*5, duration:3});
        break;

      case "defUp":
        buffs.push({type:"defUp", value:15+rarity*5, duration:3});
        break;

      case "critUp":
        buffs.push({type:"critUp", value:10+rarity*5, duration:3});
        break;

      case "drain":
        buffs.push({type:"drain", value:10+rarity*5});
        break;
    }
  }

  return buffs;
}

// ===============================
// 🔷 効果生成
// ===============================
function createEffect(category, rarity, element){

  if(category==="attack"){
    return {
      type:"damage",
      extra:[
        ...(Math.random()<0.4 ? [{type:"multiHit", hits:2+Math.floor(rarity/2), chance:40}] : []),
        ...(Math.random()<0.4 ? createDebuffEffect(rarity) : [])
      ],
      combo:createComboEffect(rarity)
    };
  }

  if(category==="debuff"){
    return {
      type:"damage",
      extra:createDebuffEffect(rarity),
      combo:createComboEffect(rarity)
    };
  }

  if(category==="buff"){
    return {
      type:"buff",
      buffs:createBuffEffect(rarity, element)
    };
  }

  if(category==="heal"){
    return {
      type:"heal",
      value:20 + rarity*10,
      bonusBuff:createBuffEffect(rarity, element)
    };
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

  let main;
  if(Math.abs(t.physical - t.magic) < 5){
    main = Math.random()<0.5 ? "物理" : "魔法";
  }else{
    main = t.physical > t.magic ? "物理" : "魔法";
  }

  const category = getSkillCategory();
  const element = elements[Math.floor(Math.random()*elements.length)];
  const target = getTarget(category);

  const variance = (Math.random()*0.4 - 0.2);

  let power = 0;
  let hits = 1;

  if(category==="attack" || category==="debuff"){
    power = Number((1 + total*0.002 + rarity*0.3 + variance).toFixed(2));
    hits = rarity>=4 ? Math.floor(Math.random()*3)+1 : 1;
  }

  if(category==="heal"){
    power = Number((total*0.01 + rarity*2).toFixed(2));
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
    effectData:createEffect(category, rarity, element),
    isCustom:true
  };
}

// ===============================
// 🔷 キャッシュ管理
// ===============================
function getGeneratedSkills(){

  const savedVersion = localStorage.getItem("skillVersion");

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
  {
    id:"s1",
    name:"星裂斬",
    power:1.2,
    hits:1,
    target:"単体",
    type:"物理",
    element:"無",
    category:"attack",
    cost:{sp:5,mp:0},
    effectData:{type:"damage"},
    isCustom:false
  },
  {
    id:"s2",
    name:"蒼流波",
    power:1.0,
    hits:1,
    target:"全体",
    type:"魔法",
    element:"水",
    category:"attack",
    cost:{sp:0,mp:8},
    effectData:{type:"damage"},
    isCustom:false
  }
];

// ===============================
// 🔷 全取得
// ===============================
function getAllSkills(){
  return [...skillMaster, ...getGeneratedSkills()];
}