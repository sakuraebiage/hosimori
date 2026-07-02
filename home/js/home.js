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

/*==================================================
Home

Background Controller

==================================================*/

const backgroundLayer =
    document.getElementById("backgroundLayer");


/*==================================================
背景変更

==================================================*/

function setBackground(id){

    const bg = BACKGROUNDS[id];

    if(!bg){

        console.warn("背景が存在しません :",id);

        return;

    }

    backgroundLayer.style.backgroundImage =
        `url("${bg.image}")`;

}


/*==================================================
保存

==================================================*/

function saveBackground(id){

    localStorage.setItem(

        "homeBackground",

        id

    );

}


/*==================================================
読込

==================================================*/

function loadBackground(){

    const id = localStorage.getItem(

        "homeBackground"

    );

    if(

        id &&
        BACKGROUNDS[id]

    ){

        setBackground(id);

    }

    else{

        setBackground("yougetsu");

    }

}


/*==================================================
設定変更

==================================================*/

function changeBackground(id){

    setBackground(id);

    saveBackground(id);

}


/*==================================================
初期化

==================================================*/

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadBackground();

    }

);