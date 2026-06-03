import type { Socket } from "socket.io-client";
import { create } from "zustand";

type WebsocketStoreState = {
	socket: Socket | null;
	setSocket: (socket: Socket | null) => void;
};

export const useWebsocketStore = create<WebsocketStoreState>((set) => ({
	socket: null,
	setSocket: (socket) => set({ socket }),
}));

const socketSelector = (state: WebsocketStoreState) => state.socket;
const setSocketSelector = (state: WebsocketStoreState) => state.setSocket;

export const useWebsocket = () => useWebsocketStore(socketSelector);
export const useSetWebsocket = () => useWebsocketStore(setSocketSelector);

export default useWebsocketStore;
