const dummyItems = [
  { name: "星鉄の欠片", count: 12 },
  { name: "未知の結晶", count: 3 },
  { name: "回復カプセル", count: 5 }
];

const grid = document.getElementById("itemGrid");

dummyItems.forEach(it => {
  const div = document.createElement("div");
  div.className = "item-card";
  div.innerHTML = `
    <div class="item-name">${it.name}</div>
    <div class="item-count">×${it.count}</div>
  `;
  grid.appendChild(div);
});
