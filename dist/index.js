import { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });
let userConnected = 0;
//
wss.on("connection", (socket) => {
    userConnected++;
    console.log('user connected' + userConnected);
});
//# sourceMappingURL=index.js.map