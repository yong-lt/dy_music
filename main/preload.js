const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // 渲染进程 ---> 主进程
    openDyRoom: url => ipcRenderer.send("openDyRoom", url),
    openMusicWin: url => ipcRenderer.send("openMusicWin", url),
    // 主进程---> 渲染进程
    message: callback => ipcRenderer.on("message", callback),
    status: callback => ipcRenderer.on("status", callback),
    getMusic: callback => ipcRenderer.on("getMusic", callback),
});
