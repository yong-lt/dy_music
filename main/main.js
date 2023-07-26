const path = require("path");
const { WebSocketServer, WebSocket } = require("ws");
const { app, BrowserWindow, ipcMain, Menu } = require("electron");
require("./server");

const _node = new WebSocket("ws://127.0.0.1:4000");

_node.onopen = () => {
    console.log("node server");
};

var mainWin = null;
var waitMusic = [];
var musicWin = null;

function createWindow() {
    Menu.setApplicationMenu(null);
    mainWin = new BrowserWindow({
        width: 500,
        height: 600,
        minWidth: 500,
        minHeight: 600,
        maxWidth: 500,
        maxHeight: 600,
        resizable: false,
        webPreferences: {
            autoHideMenuBar: true,
            preload: path.join(__dirname, "preload.js"),
        },
    });
    // 打包后资源路径
    mainWin.loadFile(path.join(__dirname, "./dist/index.html"));
    // 开发时链接
    // mainWin.loadURL("http://localhost:8080");

    // Open the DevTools.
    // mainWin.webContents.openDevTools();
}

/**
 * 打开抖音网页
 */
ipcMain.on("openDyRoom", (event, url) => {
    mainWin.webContents.send("status", true);
    const dyRoom = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, "dy.js"),
        },
    });

    dyRoom.loadURL(url);

    const wss = new WebSocketServer({
        port: 9527,
    });
    wss.on("connection", function connection(ws) {
        console.log("客户端连接成功");

        // const music = openNewWin("https://y.qq.com/");

        ws.on("message", function message(data) {
            let message = JSON.parse(data.toString());

            if (message.isFans && message.msg_content?.slice(0, 2) === "点歌") {
                waitMusic.push({ ...message, song: message.msg_content?.slice(2) });
                if (waitMusic.length === 1) {
                    openQQMusicWin();
                }
            }

            mainWin.webContents.send("message", message);
            _node.send(JSON.stringify(message));
        });

        ws.on("close", function close() {
            console.log("客户端连接断开");
        });
    });

    dyRoom.on("close", () => {
        mainWin.webContents.send("status", false);
        wss.close();
    });
});

/**
 * 弹出弹幕窗口
 */
// ipcMain.on("openMusicWin", (event, url) => {
//     const MusicWin = new BrowserWindow({
//         minHeight: 200,
//         minWidth: 300,
//         maxWidth: 400,
//         maxHeight: 600,
//         alwaysOnTop: true, // 置顶
//         skipTaskbar: true, // 隐藏任务栏
//         frame: false, // 无边框
//         transparent: true, // 是否透明
//         webPreferences: {
//             preload: path.join(__dirname, "preload.js"),
//         },
//     });

//     MusicWin.loadURL("http://localhost:8080/#" + url);
// });

ipcMain.on("getWin", () => {
    musicWin.webContents.session.webRequest.onBeforeRequest((detail, callback) => {
        if (detail.url.includes("vkey") && detail.resourceType == "media") {
            console.log(detail);
            if (!waitMusic.length) {
                return;
            }
            waitMusic[0]["musicSrc"] = detail.url;
            _node.send(JSON.stringify(waitMusic[0]));
            musicWin.close();
            waitMusic.shift();
            if (waitMusic.length) {
                openQQMusicWin();
            }
        }
        callback({});
    });
});

function openQQMusicWin() {
    musicWin = new BrowserWindow({
        width: 300,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, "music.js"),
        },
    });

    musicWin.loadURL(`https://y.qq.com/n/ryqq/search?w=${waitMusic[0].song}&t=song&remoteplace=txt.yqq.center`);

    // musicWin.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
