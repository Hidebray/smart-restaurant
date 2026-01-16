// lib/socket.ts
import { io } from "socket.io-client";

// Kết nối đến Port 3001 (nơi Socket Server đang chạy)
const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";
export const socket = io(socketUrl, {
  autoConnect: false, // Chỉ kết nối khi cần thiết để tiết kiệm tài nguyên
});