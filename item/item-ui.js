// items/item-ui.js
// アイテム図鑑・一覧UI

async function loadItems() {
  const lists = [
    { type: "消耗品", file: "consumable.json" },
    { type: "素材", file: "material.json" },
    { type: "倉庫", file: "storage.json" }
  ];

  const container = document.getElementById("itemList");
  container.innerHTML = "";

  for (const list of lists) {
    const res = await fetch(`../data/items/${list.file}`);
    const items = await res.json();

    const section = document.createElement("section");
    section.innerHTML = `<h2>${list.type}</h2>`;
    
    const ul = document.createElement("ul");

    items.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} ★${item.rarity}`;
      li.onclick = () => openItemDetail(item);
      ul.appendChild(li);
    });

    section.appendChild(ul);
    container.appendChild(section);
  }
}

// 詳細表示（後で拡張）
function openItemDetail(item) {
  alert(
    `${item.name}\n` +
    `レア度：★${item.rarity}\n` +
    `タグ：${item.tags.join(", ")}`
  );
}

document.addEventListener("DOMContentLoaded", loadItems);

