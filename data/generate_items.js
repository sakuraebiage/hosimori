(function(){
  const totalItems = 1000;

  // カテゴリと出現重み
  const categories = [
    {name:"magic", weight:20},       // 魔導素材
    {name:"mystic", weight:20},      // 霊薬素材
    {name:"nonsense", weight:10},    // トンチキ素材
    {name:"savior_gift", weight:5},  // プレゼント素材
    {name:"material", weight:15},    // 素材
    {name:"craft", weight:15},       // クラフト用素材
    {name:"rare", weight:10},        // レア
    {name:"event", weight:5}         // イベント用
  ];

  // レア度分布
  const rarityDist = {1:500,2:300,3:150,4:40,5:10};
  const valueRange = {1:[10,50],2:[50,200],3:[200,800],4:[800,3000],5:[3000,15000]};

  // カテゴリ抽選用配列作成
  const categoryPool = [];
  categories.forEach(c => { for(let i=0;i<c.weight;i++) categoryPool.push(c.name); });

  // レア度プール作成
  const rarityPool = [];
  for(const r in rarityDist){ for(let i=0;i<rarityDist[r];i++) rarityPool.push(parseInt(r)); }

  const items = [];
  for(let i=1;i<=totalItems;i++){
    const id = "item_" + i.toString().padStart(4,"0");
    const rarity = rarityPool[Math.floor(Math.random()*rarityPool.length)];
    const [minV,maxV] = valueRange[rarity];
    const value = Math.floor(Math.random()*(maxV-minV+1))+minV;
    const category = categoryPool[Math.floor(Math.random()*categoryPool.length)];
    const name = `アイテム_${id}`;
    const description = `これは${name}です。カテゴリー: ${category}、レア度: ${rarity}`;
    items.push({id,name,category,rarity,description,value});
  }

  // 拠点レア枠設定（本部は除く1〜19）
  const baseRareItems = {};
  for(let i=1;i<=19;i++){
    baseRareItems[i] = {
      individual: [items[Math.floor(Math.random()*totalItems)].id, items[Math.floor(Math.random()*totalItems)].id],
      common: [items[998].id, items[999].id] // 共通レア枠は固定で後ろ2個
    };
  }

  const result = {items,baseRareItems};

  // JSON化してダウンロード
  const blob = new Blob([JSON.stringify(result,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "items_generated.json";
  a.click();
  URL.revokeObjectURL(url);

  console.log("生成完了！items_generated.json をダウンロードしました。");
})();
