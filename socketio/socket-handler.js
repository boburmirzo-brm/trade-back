// Create a separate module for Socket.IO handling
const socketHandler = (io) => {
  // Socket.IO connection event
  io.on("connection", (socket) => {
    console.log("A user connected");

    // Example: Sending a message to the client when connected
    socket.emit("message", "Welcome to the server!");

    // Example: Handling messages from the client
    socket.on("clientMessage", (message) => {
      console.log("Received message from client:", message);
      // Broadcast the message to all connected clients
      io.emit("serverMessage", `Server says: ${message}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

module.exports = socketHandler;
