import { WebSocketServer, WebSocket } from "ws";


const wss = new WebSocketServer({ port: 8080 })

let userConnected = 0;
//
let allSockets: WebSocket[] = [];


wss.on("connection", (socket) => {
  userConnected++;
  allSockets.push(socket);

  console.log(socket);

  console.log('user connected' + userConnected);

  socket.on("message", (message) => {
    console.log("message recevied ", + message.toString());

    for (let i = 0; i < allSockets.length; i++) {
      const s = allSockets[i];
      s.send(message.toString() + ":send from the server")
    }
    socket.send(message.toString() + ": send from the server");
    console.log("last tak aya")


  })

})



