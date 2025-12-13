// =======================
// レアNPC定義
// =======================
const RARE_NPCS = [
  {
    id: "shizumi",
    name: "静海",
    baseRarity: 0.003,
    nightBoost: 2.5,
    item: "管理者の鍵",
    lines: {
      first: [
        "……ここに来るとはね。",
        "君が辿り着くとは思わなかった。"
      ],
      repeat: [
        "また君か。",
        "世界に選ばれているらしい。"
      ]
    }
  },
  {
    id: "hagi",
    name: "萩月",
    baseRarity: 0.002,
    nightBoost: 1.0,
    item: "星脈の欠片",
    lines: {
      first: [
        "あ、見つかっちゃった。",
        "こんなところで会うなんてね。"
      ],
      repeat: [
        "また来たんだ。",
        "縁があるみたいだね。"
      ]
    }
  }
];
// =======================
// 遭遇履歴管理
// =======================
const ENCOUNTER_KEY = "npc_encounters";

function getEncounters() {
  return JSON.parse(localStorage.getItem(ENCOUNTER_KEY)) || {};
}

function saveEncounter(npcId) {
  const data = getEncounters();
  data[npcId] = (data[npcId] || 0) + 1;
  localStorage.setItem(ENCOUNTER_KEY, JSON.stringify(data));
}

// 夜判定
function isNightTime() {
  const hour = new Date().getHours();
  return hour >= 19 || hour <= 5;
}

// 要素取得
const map = document.getElementById("map");
const statusPanel = document.getElementById("status-panel");
const exploreModalBg = document.getElementById("exploreModalBg");
const exploreModalTitle = document.getElementById("exploreModalTitle");
const exploreModalBody = document.getElementById("exploreModalBody");

let currentChar = JSON.parse(localStorage.getItem("currentChar")) || { name:"未設定", recentActions:[] };
const exploreLog = JSON.parse(localStorage.getItem("exploreLog")) || [];

const exploreBases = [];
const numBases = 15;
const radius = 200;

let selectedBase = null;

// 拠点生成
for(let i=0;i<numBases;i++){
  const base = document.createElement("div");
  base.classList.add("base");
  base.dataset.id = `探索地${i}`;
  base.dataset.hp = 100;
  base.dataset.resource = (Math.random()*2000+500).toFixed(0);
  base.dataset.enemies = Math.floor(Math.random()*50);
  base.textContent = base.dataset.id;

  const hpBar = document.createElement("div");
  hpBar.classList.add("hp-bar");
  const hpFill = document.createElement("div");
  hpFill.classList.add("hp-fill");
  hpBar.appendChild(hpFill);
  base.appendChild(hpBar);

  map.appendChild(base);
  exploreBases.push(base);

  base.addEventListener("click", ()=>{
    selectedBase = base;
    exploreModalBg.style.display="flex";
    exploreModalTitle.textContent = base.dataset.id;
    exploreModalBody.innerHTML = `<p>選択した探索地: ${base.dataset.id}</p>`;
  });
}

// モーダル閉じる
function closeExploreModal(){ exploreModalBg.style.display="none"; }
exploreModalBg.addEventListener("click",(e)=>{ if(e.target===exploreModalBg) closeExploreModal(); });

// 拠点配置
function positionExploreBases(){
  const centerX = map.offsetWidth/2;
  const centerY = map.offsetHeight/2;
  exploreBases.forEach((base,i)=>{
    const angle = (i/(numBases))*2*Math.PI;
    const distortX = Math.sin(angle*3)*5;
    const distortY = Math.cos(angle*5)*5;
    base.style.left = `${centerX + radius*Math.cos(angle)+distortX-27.5}px`;
    base.style.top = `${centerY + radius*Math.sin(angle)+distortY-27.5}px`;
  });
}
positionExploreBases();
window.addEventListener("resize", positionExploreBases);

// ステータス更新
function updateExploreBasesStatus(){
  exploreBases.forEach(base=>{
    let hp = Math.max(0, base.dataset.hp - Math.random()*2);
    base.dataset.hp = hp.toFixed(0);
    const hpFill = base.querySelector(".hp-fill");
    hpFill.style.width = `${hp}%`;
    hpFill.style.background = hp>60?"#00ff9d": hp>30?"#ffeb3b":"#ff4b4b";
  });
  updateExploreStatusPanel();
}

function updateExploreStatusPanel(){
  statusPanel.innerHTML="<h3>探索地ステータス</h3>";
  exploreBases.forEach(base=>{
    const entry = document.createElement("div");
    entry.classList.add("status-entry");
    entry.innerHTML = `<strong>${base.dataset.id}</strong><br>💚HP: ${base.dataset.hp}%　🪨資源: ${base.dataset.resource}　👾敵数: ${base.dataset.enemies}`;
    statusPanel.appendChild(entry);
  });
}

// アクションログ追加
function addExploreAction(action){
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = `[${timestamp}] ${action}`;
  currentChar.recentActions.unshift(logEntry);
  if(currentChar.recentActions.length>50) currentChar.recentActions.pop();
  localStorage.setItem("currentChar", JSON.stringify(currentChar));

  exploreLog.unshift(logEntry);
  if(exploreLog.length>50) exploreLog.pop();
  localStorage.setItem("exploreLog", JSON.stringify(exploreLog));
}

// ★ ボタン処理はここで一度だけ登録 ★
document.getElementById("searchBtn").onclick = () => {
  if(selectedBase) addExploreAction(`${selectedBase.dataset.id}で調査`);
  closeExploreModal();
};
document.getElementById("gatherBtn").onclick = () => {
  if(selectedBase) addExploreAction(`${selectedBase.dataset.id}で採取`);
  closeExploreModal();
};
document.getElementById("huntBtn").onclick = () => {
  if(selectedBase) addExploreAction(`${selectedBase.dataset.id}で狩猟`);
  closeExploreModal();
};

// =======================
// レア遭遇抽選
// =======================
function rollRareEncounter() {
  const encounters = getEncounters();
  const night = isNightTime();

  for (const npc of RARE_NPCS) {
    let rarity = npc.baseRarity;
    if (night) rarity *= npc.nightBoost;

    if (Math.random() < rarity) {
      const count = encounters[npc.id] || 0;
      const lines = count === 0 ? npc.lines.first : npc.lines.repeat;
      const line = lines[Math.floor(Math.random() * lines.length)];

      saveEncounter(npc.id);

      return { npc, line };
    }
  }
  return null;
}


// 初期更新
updateExploreBasesStatus();
setInterval(updateExploreBasesStatus,5000);
;
