// ===== スキル生成（固定） =====
function getGeneratedSkills(){

  let saved = localStorage.getItem("generatedSkills");
  if(saved) return JSON.parse(saved);

  const elements = ["火","水","風","光","闇"];
  const ranges = ["単体","全体","ランダム"];
  const types = ["物理","魔法"];

  const list = [];

  for(let i=0;i<150;i++){

    const type = types[Math.floor(Math.random()*2)];
    const hits = Math.ceil(Math.random()*3);
    const rarity = Math.ceil(Math.random()*5);
    const element = elements[Math.floor(Math.random()*elements.length)];

    let powerBase = 0.8 + rarity * 0.2;

    list.push({
      id:"gen_"+i,
      name:`${element}${type}技${i}`,
      power:Number((powerBase + Math.random()*0.5).toFixed(2)),
      hits:hits,
      range:ranges[Math.floor(Math.random()*ranges.length)],
      type:type,
      element:element,
      rarity:rarity,
      cost:{
        sp:type==="物理"?hits*5:0,
        mp:type==="魔法"?hits*5:0
      },
      special:
        rarity>=4 ? "会心強化" :
        hits>=3 ? "連撃" :
        "通常"
    });
  }

  localStorage.setItem("generatedSkills", JSON.stringify(list));
  return list;
}

// ===== マスター =====
const skillMaster = [
  {id:"s1",name:"星裂斬",power:1.2,hits:1,range:"単体",type:"物理",element:"無",rarity:3,cost:{sp:5,mp:0}},
  {id:"s2",name:"蒼流波",power:1.0,hits:1,range:"全体",type:"魔法",element:"水",rarity:3,cost:{sp:0,mp:8}},
  {id:"s3",name:"月影突",power:0.9,hits:2,range:"単体",type:"物理",element:"闇",rarity:4,cost:{sp:3,mp:2}},
  ...getGeneratedSkills()
];

function getAllSkills(){
  return skillMaster;
}