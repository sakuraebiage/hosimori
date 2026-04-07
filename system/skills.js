// ===== 属性 =====
const elements = [
  "無",
  "火","水","雷",
  "氷","風","土",
  "光","闇"
];

// ===== 名前素材 =====
const nameParts = {
  prefix: ["紅蓮","蒼","雷鳴","氷牙","疾風","影","聖","魔","星","虚無"],
  physical: ["斬","撃","突","断","砕","連斬","崩し"],
  magic: ["波","弾","術","爆","嵐","陣","閃"],
  suffix: ["改","式","破","極","零","真"]
};

// ===== 名前生成 =====
function generateSkillName(main, element, rarity){

  const p = nameParts.prefix[Math.floor(Math.random()*nameParts.prefix.length)];

  const core = main==="物理"
    ? nameParts.physical[Math.floor(Math.random()*nameParts.physical.length)]
    : nameParts.magic[Math.floor(Math.random()*nameParts.magic.length)];

  const s = rarity>=4
    ? nameParts.suffix[Math.floor(Math.random()*nameParts.suffix.length)]
    : "";

  return `${element}${p}${core}${s}`;
}

// ===== レア度 =====
function getRarity(total){
  if(total > 200) return 5;
  if(total > 120) return 4;
  if(total > 60) return 3;
  return 2;
}

// ===== 総合値 =====
function getTotalPower(){
  const t = getTotalStats();
  return Object.values(t).reduce((a,b)=>a+b,0);
}

// ===== スキル生成 =====
function generateSkill(i){

  const t = getTotalStats();
  const total = getTotalPower();
  const rarity = getRarity(total);

  const main = t.physical > t.magic ? "物理" : "魔法";

  const element = elements[Math.floor(Math.random()*elements.length)];

  const power = Number((1 + total*0.002 + rarity*0.3).toFixed(2)) || 1;

  const hits = rarity >= 4 ? Math.floor(Math.random()*3)+2 : 1;

  const target = rarity >= 3
    ? (Math.random()>0.5 ? "全体" : "単体")
    : "単体";

  const cost = {
    sp: main==="物理" ? Math.floor(power*5) : 0,
    mp: main==="魔法" ? Math.floor(power*5) : 0
  };

  return {
    id:"g"+i,
    name: generateSkillName(main, element, rarity),
    power,
    hits,
    target,
    type:main,
    element,
    cost,
    isCustom:true
  };
}

// ===== 生成キャッシュ =====
function getGeneratedSkills(){
localStorage.removeItem("genSkills");
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