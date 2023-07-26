const { ipcRenderer } = require("electron");

window.onload = () => {
    setTimeout(() => {
        const plays = document.querySelectorAll(".list_menu__icon_play");
        plays[0].click();
        ipcRenderer.send("getWin");
    }, 2000);
};
