// lib/socket.ts
import { io } from "socket.io-client";

// Kết nối đến Port 3001 (nơi Socket Server đang chạy)
export const socket = io("http://localhost:3001", {
  autoConnect: false, // Chỉ kết nối khi cần thiết để tiết kiệm tài nguyên
});