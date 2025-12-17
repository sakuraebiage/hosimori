// ===== 設定 =====
const MATERIAL_COUNT = 600;
const CONSUMABLE_COUNT = 300;
const EQUIPMENT_COUNT = 200;

// ===== 共通素材 =====
const rarityTable = [1,1,1,2,2,3,3,4,5];

function rand(arr){
  return arr[Math.floor(Math.random()*arr.length)];
}

function pad(num){
  return num.toString().padStart(3,"0");
}

// ===== 素材 =====
function generateMaterials(count){
  const names = ["星鉄","星脈","虚晶","輝核","黒曜","残響","宙石","深層"];
  const suffix = ["欠片","結晶","塊","粒子","鉱","残滓"];

  return Array.from({length:count},(_,i)=>({
    id:`mat_${pad(i+1)}`,
    name:`${rand(names)}の${rand(suffix)}`,
    type:"material",
    rarity:rand(rarityTable),
    stack:99,
    desc:"クラフトに使用される素材",
    tags:["material"]
  }));
}

// ===== 消耗品 =====
function generateConsumables(count){
  const names = ["回復","強化","覚醒","再生","遮断","加速"];
  const types = ["カプセル","注射剤","パック","アンプ"];

  return Array.from({length:count},(_,i)=>({
    id:`con_${pad(i+1)}`,
    name:`${rand(names)}${rand(types)}`,
    type:"consumable",
    rarity:rand(rarityTable),
    stack:20,
    effect:{},
    desc:"使用すると効果を発揮する消耗品"
  }));
}

// ===== 装備 =====
function generateEquipment(count){
  const weapons = ["ブレード","ライフル","ランス","アーク","ナイフ"];
  const armors = ["外套","装甲","スーツ","コア"];
  const slots = ["weapon","armor"];

  return Array.from({length:count},(_,i)=>{
    const slot = rand(slots);
    return {
      id:`eq_${pad(i+1)}`,
      name:`星${rand(slot==="weapon"?weapons:armors)}`,
      type:"equipment",
      slot,
      rarity:rand(rarityTable),
      stack:1,
      stats:{},
      desc:"装備することで能力が上昇する"
    };
  });
}

// ===== 出力 =====
const materials   = generateMaterials(MATERIAL_COUNT);
const consumables = generateConsumables(CONSUMABLE_COUNT);
const equipment   = generateEquipment(EQUIPMENT_COUNT);

console.log("=== materials.json ===");
console.log(JSON.stringify(materials,null,2));
console.log("=== consumables.json ===");
console.log(JSON.stringify(consumables,null,2));
console.log("=== equipment.json ===");
console.log(JSON.stringify(equipment,null,2));