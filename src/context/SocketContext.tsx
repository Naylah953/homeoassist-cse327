/**
 * context/SocketContext.tsx
 * Global Socket.IO connection — shared across all components
 */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SOCKET_URL = 'http://localhost:5000';

interface SocketContextValue {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextValue>({ socket: null, connected: false });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { token, role } = useAuth();
  const [socket, setSocket]       = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token) return;

    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    s.on('connect',    () => setConnected(true));
    s.on('disconnect', () => setConnected(false));

    // Auto-announce doctor presence
    if (role === 'doctor') {
      s.emit('doctor:online', { doctor_id: null }); // id from token on server
    }

    setSocket(s);
    return () => { s.disconnect(); };
  }, [token, role]);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);
