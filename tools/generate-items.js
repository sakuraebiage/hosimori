function generateItem(index, type){
  return {
    id: `${type}_${String(index).padStart(4,"0")}`,
    name: `未命名${index}`,
    type: type,
    rarity: 1,
    stack: type==="equipment"?1:99,
    warehouse: type!=="consumable",

    tags: [type],

    drops: {
      forest: 0.3
    },

    description: "",
    hint: "出現条件は不明",

    value: 10
  };
}

// 600個生成
const items = [];
for(let i=1;i<=600;i++){
  items.push(generateItem(i,"material"));
}

console.log(JSON.stringify(items,null,2));
