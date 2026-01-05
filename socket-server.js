
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for simplicity in development
    methods: ["GET", "POST"]
  },
});

const PORT = process.env.SOCKET_PORT || 3001;

io.on("connection", (socket) => {
  console.log(`✅ Client connected: ${socket.id}`);

  socket.on("JOIN_ROOM", (roomName) => {
    socket.join(roomName);
    console.log(`SOCKET [${socket.id}] joined room [${roomName}]`);
  });

  socket.on("NEW_ORDER", (orderData) => {
    // Broadcast to all staff members in the 'staff' room
    console.log(`EVENT [NEW_ORDER] received for table [${orderData.tableNumber}]. Broadcasting to 'staff' room.`);
    io.to("staff").emit("NEW_ORDER_NOTIFICATION", orderData);
  });
  
  socket.on("ORDER_STATUS_UPDATE", (data) => {
    // Broadcast to a specific table room (e.g., 'table_t1')
    console.log(`EVENT [ORDER_STATUS_UPDATE] for room [${data.room}]. Broadcasting status [${data.payload.status}].`);
    io.to(data.room).emit("ORDER_STATUS_UPDATED", data.payload);
  });

  socket.on("disconnect", (reason) => {
    console.log(`❌ Client disconnected: ${socket.id}. Reason: ${reason}`);
  });
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.IO server running on port ${PORT}`);
});
