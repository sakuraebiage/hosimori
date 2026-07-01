alert("読み込まれた！！");
const backgrounds = [
    "images/backgrounds/ChatGPT Image 2026年6月28日 17_53_03.png"
];

console.log("背景ランダム成功");

document.getElementById("backgroundImage").src =
backgrounds[0];

/*=====================================
ANIMUS TERMINAL
=====================================*/

const terminal=document.getElementById("mobileTerminal");

const header=document.getElementById("terminalHeader");

header.addEventListener("click",()=>{

    terminal.classList.toggle("open");

});