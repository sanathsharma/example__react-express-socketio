import type { ServerOptions } from "socket.io";

export const PORT = 3000;

export const SOCKET_IO_CORS_OPTIONS: ServerOptions["cors"] = {
	origin: "http://localhost:5173",
	methods: ["GET", "POST"],
};
