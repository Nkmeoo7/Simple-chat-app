import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

const rooms = new Map<string, Set<WebSocket>>();

wss.on("connection", (socket) => {
  console.log('A new user connected.');

  let currentRoom: string | null = null;

  socket.on("message", (message) => {
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message.toString());
    } catch (error) {
      console.error("Failed to parse message:", message.toString());
      return
    }

    //join the room
    if (parsedMessage.type === "join" && typeof parsedMessage.payload?.roomId === 'string') {
      const roomId = parsedMessage.payload.roomId;
      currentRoom = roomId;

      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      rooms.get(roomId)?.add(socket);

      console.log(`User joined room: ${roomId}`);

      // Send a confirmation message back to the client who just joined.
      // The frontend is now waiting for this message;
      //
      socket.send(JSON.stringify({
        type: 'join-success',
        payload: { roomId: roomId }
      }));
    }

    //chat logic
    else if (parsedMessage.type === "chat" && parsedMessage.payload?.message) {
      if (currentRoom && rooms.has(currentRoom)) {
        const messageToSend = parsedMessage.payload.message;

        //every user of that needs this message
        rooms.get(currentRoom)?.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            //string format me bacause WebSocket needs string;
            client.send(JSON.stringify({ type: 'chat', payload: messageToSend }));
          }
        });

        console.log(`Message broadcasted in room ${currentRoom}: ${messageToSend}`);
      }
    }
  });

  socket.on("close", () => {
    console.log('A user disconnected.');

    if (currentRoom && rooms.has(currentRoom)) {
      rooms.get(currentRoom)?.delete(socket);

      if (rooms.get(currentRoom)?.size === 0) {
        rooms.delete(currentRoom);
        console.log(`Room ${currentRoom} is now empty and has been removed.`);
      }
    }
  });

  socket.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

console.log("WebSocket server started on port 8080");
