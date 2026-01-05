
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Define the type for the socket instance, allowing for null
type SocketType = ReturnType<typeof io> | null;

// The URL of our standalone socket server
const SOCKET_URL = 'http://localhost:3001';

interface ISocketContext {
  socket: SocketType;
  isConnected: boolean;
}

const SocketContext = createContext<ISocketContext>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<SocketType>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize the socket connection
    const socketInstance = io(SOCKET_URL);

    socketInstance.on('connect', () => {
      console.log('Socket connected to server!');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected from server.');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Cleanup on component unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
