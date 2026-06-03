import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";

export const SocketContext = createContext<Socket | null>(null);
export const SetSocketContext = createContext<(socket: Socket | null) => void>(() => {});

export const useWebsocket = () => useContext(SocketContext);
export const useSetWebsocket = () => useContext(SetSocketContext);

