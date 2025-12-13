const container = document.getElementById("resultContainer");
const allResults = getAllResults();

function renderResults(){
  container.innerHTML = "";

  Object.keys(allResults).forEach(type=>{
    allResults[type].forEach(entry=>{
      const div = document.createElement("div");
      div.classList.add("result-entry");

      if(entry.result.includes("NPC")){
        div.classList.add("result-rare");
      } else {
        div.classList.add(`result-${type}`);
      }

      div.innerHTML = `
        <h4>[${type.toUpperCase()}] ${entry.timestamp}</h4>
        <div>${entry.result}</div>
      `;
      container.appendChild(div);
    });
  });
}

renderResults();
