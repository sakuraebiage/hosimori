// ===============================
// アイテム管理データ
// ===============================
const INVENTORY_LIMIT = 50;

let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let storage   = JSON.parse(localStorage.getItem("storage")) || [];

let currentList = "inventory"; // 表示中

const INVENTORY_LIMIT = 50;
const grid = document.getElementById("itemGrid");
const tabInv = document.getElementById("tabInventory");
const tabSto = document.getElementById("tabStorage");

const modalBg = document.getElementById("itemModal");
const modalName = document.getElementById("modalName");
const modalDesc = document.getElementById("modalDesc");
const toDexBtn = document.getElementById("toDexBtn");

let inventory = [];
let storage = [];
let currentList = "inventory";

/* -----------------------
   データ読み込み
----------------------- */
async function loadItems() {
  inventory = await fetch("../data/items/consumables.json").then(r=>r.json());
  storage   = await fetch("../data/items/materials.json").then(r=>r.json());
  renderItems(inventory);
}

function renderItems(list) {
  grid.innerHTML = "";
  list.forEach(it=>{
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <div class="item-name">${it.name}</div>
      <div class="item-count">×${it.count}</div>
    `;
    div.onclick = ()=>openModal(it);
    grid.appendChild(div);
  });
}

/* -----------------------
   タブ切り替え
----------------------- */
tabInv.onclick = ()=>{
  currentList="inventory";
  tabInv.classList.add("active");
  tabSto.classList.remove("active");
  renderItems(inventory);
};

tabSto.onclick = ()=>{
  currentList="storage";
  tabSto.classList.add("active");
  tabInv.classList.remove("active");
  renderItems(storage);
};

/* -----------------------
   モーダル
----------------------- */
function openModal(item){
  modalName.textContent = item.name;
  modalDesc.textContent = item.desc || "詳細データなし";
  toDexBtn.onclick = ()=>{
    location.href = `../encyclopedia/index.html?item=${encodeURIComponent(item.id)}`;
  };
  modalBg.style.display = "flex";
}
function closeModal(){
  modalBg.style.display = "none";
}
function gainItem(item){
  // インベントリに同種があるか
  const inv = inventory.find(i=>i.id===item.id);
  if(inv){
    inv.count += item.count;
    saveItems();
    return;
  }

  // 空きあり
  if(inventory.length < INVENTORY_LIMIT){
    inventory.push(item);
    saveItems();
    return;
  }

  // 満杯 → 倉庫
  const sto = storage.find(i=>i.id===item.id);
  if(sto){
    sto.count += item.count;
  } else {
    storage.push(item);
  }
   const grid = document.getElementById("itemGrid");

function renderItems(list){
  grid.innerHTML = "";
  list.forEach(it=>{
    const div = document.createElement("div");
    div.className = "item-card";
    div.innerHTML = `
      <div class="item-name">${it.name}</div>
      <div class="item-count">×${it.count}</div>
    `;
    grid.appendChild(div);
  });
}

// 初期表示
renderItems(inventory);

  saveItems();
}


loadItems();
