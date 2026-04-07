// ===== 属性 =====
const attackElements = [
  "無",
  "火","水","雷",
  "氷","風","土",
  "光","闇"
];

const sacredElements = [
  "星","月","陽"
];

// ===== 名前素材 =====
const nameParts = {
  prefix: ["紅蓮","蒼","雷鳴","氷牙","疾風","影","聖","魔"],
  physical: ["斬","撃","突","断","砕","連斬","崩し"],
  magic: ["波","弾","術","爆","嵐","陣","閃"],
  suffix: ["改","式","破","極","零","真","滅"]
};

// ===== スキル種別 =====
function getSkillCategory(){
  const r = Math.random();
  if(r < 0.7) return "attack";
  if(r < 0.9) return "buff";
  return "heal";
}

// ===== 名前生成 =====
function generateSkillName(main, element, rarity, category){

  const p = nameParts.prefix[Math.floor(Math.random()*nameParts.prefix.length)];

  const core = main==="物理"
    ? nameParts.physical[Math.floor(Math.random()*nameParts.physical.length)]
    : nameParts.magic[Math.floor(Math.random()*nameParts.magic.length)];

  const s = rarity>=4
    ? nameParts.suffix[Math.floor(Math.random()*nameParts.suffix.length)]
    : "";

  if(category === "attack"){
    return `${element}${p}${core}${s}`;
  }

  if(category === "buff"){
    const sacred = sacredElements[Math.floor(Math.random()*sacredElements.length)];
    return `${sacred}の加護`;
  }

  if(category === "heal"){
    const sacred = sacredElements[Math.floor(Math.random()*sacredElements.length)];
    return `${sacred}の癒し`;
  }
}

// ===== レア度 =====
function getRarity(total){
  if(total > 600) return 6;
  if(total > 400) return 5;
  if(total > 200) return 4;
  if(total > 100) return 3;
  return 2;
}

// ===== 総合値 =====
function getTotalPower(){
  const t = getTotalStats();
  return Object.values(t).reduce((a,b)=>a+b,0);
}

// ===== 複合属性 =====
function getElement(i){

  if(i >= 200 && Math.random() < 0.5){
    const e1 = attackElements[Math.floor(Math.random()*attackElements.length)];
    const e2 = attackElements[Math.floor(Math.random()*attackElements.length)];
    if(e1 !== e2){
      return `${e1}+${e2}`;
    }
  }

  return attackElements[Math.floor(Math.random()*attackElements.length)];
}

// ===== スキル生成 =====
function generateSkill(i){

  const t = getTotalStats();
  const total = getTotalPower();
  const rarity = getRarity(total);

  const category = getSkillCategory();

  const main = t.physical > t.magic ? "物理" : "魔法";

  const element = getElement(i);

  const name = generateSkillName(main, element, rarity, category);

  let power = Number(
    (1 + total*0.005 + rarity*0.6 + Math.random()*0.8)
    .toFixed(2)
  );

  let hits = 1;
  let target = "単体";

  // ===== 分岐 =====
  if(category === "attack"){
    hits = rarity >= 5
      ? Math.floor(Math.random()*4)+2
      : rarity >= 4
      ? Math.floor(Math.random()*3)+2
      : 1;

    target = rarity >= 4
      ? (Math.random()>0.4 ? "全体" : "単体")
      : "単体";
  }

  if(category === "buff"){
    power = 0;
    target = "味方全体";
  }

  if(category === "heal"){
    power = Number((total*0.01 + rarity*2).toFixed(2));
    target = "味方単体";
  }

  const cost = {
    sp: main==="物理" ? Math.floor(power*4 + hits*2) : 0,
    mp: main==="魔法" ? Math.floor(power*4 + hits*2) : 5
  };

  return {
    id:"g"+i,
    name,
    power,
    hits,
    target,
    type:main,
    element,
    category,
    rarity,
    cost,
    isCustom:true
  };
}

// ===== 生成キャッシュ =====
function getGeneratedSkills(){

  let data = JSON.parse(localStorage.getItem("genSkills"));

  if(!data){
    data=[];
    for(let i=0;i<400;i++){
      data.push(generateSkill(i));
    }
    localStorage.setItem("genSkills", JSON.stringify(data));
  }

  return data;
}

// ===== 固定スキル =====
const skillMaster = [
  {id:"s1",name:"星裂斬",power:1.2,hits:1,target:"単体",type:"物理",element:"無",cost:{sp:5,mp:0},isCustom:false},
  {id:"s2",name:"蒼流波",power:1.0,hits:1,target:"全体",type:"魔法",element:"水",cost:{sp:0,mp:8},isCustom:false},
  {id:"s3",name:"月影突",power:0.9,hits:2,target:"単体",type:"物理",element:"闇",cost:{sp:3,mp:2},isCustom:false}
];

// ===== 全スキル =====
function getAllSkills(){
  return [...skillMaster, ...getGeneratedSkills()];
}