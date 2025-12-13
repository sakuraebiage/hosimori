// log/result.js
// 戦闘・探索・救助・クラフトの結果を管理する共通ロジック

const RESULT_KEY = "game_results";

// 初期化
function initResults() {
  if (!localStorage.getItem(RESULT_KEY)) {
    const initialData = {
      combat: [],
      explore: [],
      rescue: [],
      craft: []
    };
    localStorage.setItem(RESULT_KEY, JSON.stringify(initialData));
  }
}

// 結果追加関数
function addResult(type, result) {
  // type: "combat" | "explore" | "rescue" | "craft"
  const data = JSON.parse(localStorage.getItem(RESULT_KEY)) || {};
  if (!data[type]) data[type] = [];
  const timestamp = new Date().toLocaleString();
  data[type].unshift({ timestamp, result });
  // 最大履歴数を20件に制限
  if (data[type].length > 20) data[type] = data[type].slice(0, 20);
  localStorage.setItem(RESULT_KEY, JSON.stringify(data));
}

// 指定タイプの結果取得
function getResults(type) {
  const data = JSON.parse(localStorage.getItem(RESULT_KEY)) || {};
  return data[type] || [];
}

// 全結果取得（オプション）
function getAllResults() {
  return JSON.parse(localStorage.getItem(RESULT_KEY)) || {};
}

// 初期化実行
initResults();
