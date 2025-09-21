import { WebSocketServer, WebSocket } from "ws";


const wss = new WebSocketServer({ port: 8080 })

interface User {
  socket: WebSocket;
  room: String;

}


let userConnected = 0;
let allSockets: User[] = [];


//

wss.on("connection", (socket) => {
  userConnected++;


  console.log('user connected' + userConnected);

  socket.on("message", (message) => {
    console.log("message recevied ", + message.toString());

    const parsedMessage = JSON.parse(message as unknown as string);

    if (parsedMessage.type == "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId
      })
    }

    if (parsedMessage.type == "chat") {

      //@ts-ignore
      const currentUserRoom = allSockets.find((x) => x.socket == socket).room


      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].room == currentUserRoom) {
          //@ts-ignore
          allSockets[i].socket.send(parsedMessage.payload.message)
        }
      }



    }



  })

})



