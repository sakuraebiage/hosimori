// =====================
// スキル生成パーツ
// =====================
const elements = ["炎","氷","雷","風","光","闇"];
const types = ["斬","波","突","撃","連撃"];
const targets = ["単体","全体"];
const styles = ["改","極","零","滅"];

// =====================
// 手作りスキル（固定）
// =====================
const manualSkills = [
  {
    id:"s0",
    name:"星裂斬",
    power:1.2,
    target:"単体",
    cost:{ sp:5, mp:0 },
    desc:"物理攻撃"
  }
];

// =====================
// ランダム生成
// =====================
function generateSkills(){

  const list = [];
  let id = 1;

  elements.forEach(elem=>{
    types.forEach(type=>{
      targets.forEach(target=>{
        styles.forEach(style=>{

          list.push({
            id: "g" + id++,

            name: `${elem}${type}・${style}`,

            power:
              target==="単体"
                ? 1.1 + Math.random()*0.5
                : 0.9 + Math.random()*0.3,

            target: target,

            cost:{
              sp: Math.floor(Math.random()*6),
              mp: Math.floor(Math.random()*10)
            },

            desc: `${elem}属性の${type}（${style}）`
          });

        });
      });
    });
  });

  return list;
}

// =====================
// 保存 or 読み込み
// =====================
let generatedSkills = JSON.parse(localStorage.getItem("generatedSkills"));

if(!generatedSkills){

  generatedSkills = generateSkills();

  localStorage.setItem("generatedSkills", JSON.stringify(generatedSkills));

  console.log("スキル生成完了！");
}else{
  console.log("保存済みスキル読み込み");
}

// =====================
// 最終スキル
// =====================
const skillMaster = [
  ...manualSkills,
  ...generatedSkills
];
