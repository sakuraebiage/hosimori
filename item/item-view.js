const list = document.getElementById("item-list");
const detail = document.getElementById("item-detail");

document.querySelectorAll("#tabs button").forEach(btn=>{
  btn.onclick = async ()=>{
    const type = btn.dataset.type;
    await loadItems(type);
    renderItems(type);
  };
});

function renderItems(type){
  list.innerHTML = "";
  items.forEach(item=>{
    const owned = getItemCount(item);

    const div = document.createElement("div");
    div.className = "item";

    div.textContent = owned
      ? `${item.name} ×${owned}`
      : "？？？";

    div.onclick = ()=>showDetail(item, owned);
    list.appendChild(div);
  });
}

function showDetail(item, owned){
  detail.hidden = false;
  document.getElementById("detail-name").textContent =
    owned ? item.name : "未取得アイテム";
  document.getElementById("detail-desc").textContent =
    owned ? item.description : item.hint;
}
