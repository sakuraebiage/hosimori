// log/result-view.js

// URLの #explore / #combat などを取得
const type = location.hash.replace("#", "") || "explore";

// タイトル
const titleMap = {
  combat: "⚔ 戦闘結果ログ",
  explore: "🧭 探索結果ログ",
  rescue: "🩹 救助結果ログ",
  craft: "🛠 クラフト結果ログ"
};

document.getElementById("log-title").textContent =
  titleMap[type] || "行動結果ログ";

// 結果取得
const results = getResults(type);

// 表示
const list = document.getElementById("result-list");

if (results.length === 0) {
  list.innerHTML = "<p>まだ記録がありません。</p>";
} else {
  results.forEach(r => {
    const div = document.createElement("div");
    div.className = "log-entry";
    div.innerHTML = `
      <div class="time">${r.timestamp}</div>
      <div class="text">${r.result}</div>
    `;
    list.appendChild(div);
  });
}
