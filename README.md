# 抖音弹幕点歌

## 安装
```
npm install
```

### 修改主程序启动地址
```
// main.js
// 打包后资源路径
mainWin.loadFile(path.join(__dirname, "./dist/index.html"));
// 开发时链接
// mainWin.loadURL("http://localhost:8080");
```

### 启动项目
```
// 启动前端页面
npm run dev

// 启动Electron
npm run client
```
