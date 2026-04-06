// ===== スキル生成（安全版） =====
function getGeneratedSkills(){
  // 今は空（ここ後で拡張できる）
  return [];
}

// ===== マスター =====
const skillMaster = [
  {
    id:"s1",
    name:"星裂斬",
    power:1.2,
    hits:1,
    range:"単体",
    type:"物理",
    element:"無",
    rarity:3,
    cost:{sp:5,mp:0}
  },
  {
    id:"s2",
    name:"蒼流波",
    power:1.0,
    hits:1,
    range:"全体",
    type:"魔法",
    element:"水",
    rarity:3,
    cost:{sp:0,mp:8}
  },
  {
    id:"s3",
    name:"月影突",
    power:0.9,
    hits:2,
    range:"単体",
    type:"物理",
    element:"闇",
    rarity:4,
    cost:{sp:3,mp:2}
  },

  // 🔥 ここが安全化ポイント
  ...(getGeneratedSkills() || [])
];

// ===== 取得 =====
function getAllSkills(){
  return skillMaster;
}