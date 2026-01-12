// server.ts
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Cho phép mọi nguồn kết nối (để dev cho dễ)
    methods: ["GET", "POST"]
  }
});

// Danh sách các sự kiện (Events)
// 1. "new-order": Khách gửi đơn -> Server nhận -> Bắn cho Bếp/Waiter
// 2. "order-update": Bếp/Waiter đổi trạng thái -> Server nhận -> Bắn cho Khách

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Khách/Waiter tham gia vào "room" của bàn cụ thể (để nhận noti riêng cho bàn đó)
  socket.on("join-table", (tableId) => {
    socket.join(`table-${tableId}`);
    console.log(`Socket ${socket.id} joined table-${tableId}`);
  });

  // Nhân viên (Bếp/Waiter) tham gia room "staff" (để nhận tất cả đơn)
  socket.on("join-staff", () => {
    socket.join("staff-room");
    console.log(`Staff ${socket.id} joined staff-room`);
  });

  // Xử lý sự kiện: Có đơn mới
  socket.on("new-order", (orderData) => {
    console.log("New order received:", orderData.id);
    
    // Gửi cho toàn bộ nhân viên (Bếp + Waiter)
    io.to("staff-room").emit("new-order-received", orderData);
    
    // Gửi xác nhận lại cho bàn đó (nếu cần animation bay bay)
    io.to(`table-${orderData.tableId}`).emit("order-success", orderData);
  });

  // Xử lý sự kiện: Cập nhật trạng thái (Bếp xong -> Waiter bưng)
  socket.on("update-order-status", (data) => {
    const { orderId, tableId, status } = data;
    console.log(`Order ${orderId} updated to ${status}`);

    // Báo cho bàn ăn biết để cập nhật UI khách
    io.to(`table-${tableId}`).emit("status-changed", { orderId, status });
    
    // Báo cho các nhân viên khác biết (đồng bộ màn hình các nhân viên)
    io.to("staff-room").emit("status-changed", { orderId, status });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = 3001; // Chạy port khác với Next.js (3000)
httpServer.listen(PORT, () => {
  console.log(`🚀 Socket Server running on http://localhost:${PORT}`);
});