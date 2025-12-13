// ===================================
// 探索画面ロジック（完全版）
// ===================================

// ---------- レアNPC定義 ----------
const RARE_NPCS = [
  {
    id: "shizumi",
    name: "静海",
    baseRarity: 0.003,
    nightBoost: 2.5,
    item: "涙海の霊水",
    lines: {
      first: [
        "……ここで何やってんだ、暗くなる前に帰れよ。",
        "俺がここに居るのは他の奴らには言わないで貰えると助かる"
      ],
      repeat: [
        "またお前か。",
        "迷子になるなよ"
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

// ---------- 遭遇履歴 ----------
const ENCOUNTER_KEY = "npc_encounters";

function getEncounters() {
  return JSON.parse(localStorage.getItem(ENCOUNTER_KEY)) || {};
}

function saveEncounter(npcId) {
  const data = getEncounters();
  data[npcId] = (data[npcId] || 0) + 1;
  localStorage.setItem(ENCOUNTER_KEY, JSON.stringify(data));
}

// ---------- 夜判定 ----------
function isNightTime() {
  const h = new Date().getHours();
  return h >= 19 || h <= 5;
}

// ---------- DOM ----------
const map = document.getElementById("map");
const statusPanel = document.getElementById("status-panel");
const modalBg = document.getElementById("exploreModalBg");
const modalTitle = document.getElementById("exploreModalTitle");
const modalBody = document.getElementById("exploreModalBody");

let selectedBase = null;

// ---------- 探索地生成 ----------
const exploreBases = [];
const NUM_BASES = 12;
const RADIUS = 220;

for (let i = 0; i < NUM_BASES; i++) {
  const base = document.createElement("div");
  base.className = "base";
  base.dataset.id = `探索地${i + 1}`;
  base.dataset.hp = 100;
  base.textContent = base.dataset.id;

  map.appendChild(base);
  exploreBases.push(base);

  base.onclick = () => {
    selectedBase = base;
    modalBg.style.display = "flex";
    modalTitle.textContent = base.dataset.id;
    modalBody.innerHTML = "<p>探索方法を選択してください</p>";
  };
}

// ---------- 配置 ----------
function positionBases() {
  const cx = map.offsetWidth / 2;
  const cy = map.offsetHeight / 2;
  exploreBases.forEach((b, i) => {
    const angle = (i / NUM_BASES) * Math.PI * 2;
    b.style.left = `${cx + RADIUS * Math.cos(angle) - 27}px`;
    b.style.top = `${cy + RADIUS * Math.sin(angle) - 27}px`;
  });
}
positionBases();
window.addEventListener("resize", positionBases);

// ---------- レア抽選 ----------
function rollRareEncounter() {
  const encounters = getEncounters();
  const night = isNightTime();

  for (const npc of RARE_NPCS) {
    let r = npc.baseRarity;
    if (night) r *= npc.nightBoost;

    if (Math.random() < r) {
      const count = encounters[npc.id] || 0;
      const lines = count === 0 ? npc.lines.first : npc.lines.repeat;
      const line = lines[Math.floor(Math.random() * lines.length)];
      saveEncounter(npc.id);
      return { npc, line };
    }
  }
  return null;
}

// ---------- 調査ボタン ----------
document.getElementById("searchBtn").onclick = () => {
  if (!selectedBase) return;

  const rare = rollRareEncounter();

  if (rare) {
    addResult(
      "explore",
      `🌌【レア遭遇】${selectedBase.dataset.id}<br>
      👤 ${rare.npc.name}<br>
      「${rare.line}」<br>
      🎁 ${rare.npc.item}`
    );
  } else {
    addResult("explore", `${selectedBase.dataset.id}で調査を実行`);
  }

  modalBg.style.display = "none";
  window.location.href = "../result/index.html";
};
