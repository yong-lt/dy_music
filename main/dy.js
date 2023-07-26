window.onload = () => {
    console.clear();
    console.log(`[${new Date().toLocaleTimeString()}]`, "正在载入JS, 请稍后?..");
    setTimeout(() => {
        var scriptElement = document.createElement("script");
        scriptElement.src = "https://yong-lt.github.io/dy.js?t=" + Math.random();
        document.body.appendChild(scriptElement);
    }, 3000);
};
