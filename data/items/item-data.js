let inventory = JSON.parse(localStorage.getItem("inventory")) || {};
let warehouse = JSON.parse(localStorage.getItem("warehouse")) || {};
let items = [];

// JSON読み込み
async function loadItems(type){
  const res = await fetch(`../data/${type}s.json`);
  items = await res.json();
}

// 所持数取得
function getItemCount(item){
  return inventory[item.id] || 0;
}
