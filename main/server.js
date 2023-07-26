const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());

app.use(cors());

const { WebSocketServer, WebSocket } = require("ws");

const wss = new WebSocketServer({ port: 4000 });

wss.on("connection", function connection(ws) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
        console.log("点歌信息：", JSON.parse(data));
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(JSON.parse(data)));
            }
        });
    });
});

app.listen(3000, () => console.log("Server running on prot 3000"));
