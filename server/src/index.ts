import { Server } from "socket.io";
import { buildApp } from "./app.ts";
import { PORT, SOCKET_IO_CORS_OPTIONS } from "./constants.ts";
import { CLIENT_EVENTS, SERVER_EVENTS } from "./events.ts";

const app = buildApp();
const server = app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const io = new Server(server, {
	cors: SOCKET_IO_CORS_OPTIONS,
});

/* Expose the socket.io server instance to the app
 *
 * Usage with in handler: 
 * const io = req.app.get("io");
 * io.to("socket-id").emit("event-name", "data");
 */
app.set("io", io);

io.use((socket, next) => {
	console.log("Socket connected", socket);
	// if token is passed by client in the auth.token field during connection extract token as following for validation
	// const token = socket.handshake.auth.token;
	
	// from cookie
	// use cookie library to extract token from cookie
	// const cookieHeader = socket.handshake.headers.cookie;
	// if (!cookieHeader) {
  //   return next(new Error("Authentication error: No cookies"));
  // }
  //
  // const cookies = cookie.parse(cookieHeader);
  // const token = cookies.authToken;

	// validate and throw error if token is invalid
	// if (token !== 'SAMPLE_TOKEN_FOR_AUTHENTICATION') {
	// 	next(new Error('Invalid token'));
	// }
	
	// socket.userId = decodedToken.userId;
	next();
});

io.on("connection", (socket) => {
	console.log("A user connected");
	// Make user join to a room with his userId, so that api handles can emit events to the user via the room, so that socket id need not be directly linked to the user
	// const userId = socket.userId;
	// socket.join(`user-${userId}`);
	// Example of emitting event to a user
	// const socket = req.app.get("io");
	// socket.to(`user-${userId}`).emit('job_complete', { jobId: 1234, status: 'completed' });

	socket.on(CLIENT_EVENTS.SEND_MESSAGE, (data) => {
		console.log("Message sent:", data);
		socket.emit(SERVER_EVENTS.RECEIVE_MESSAGE, data);
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected");
		// socket.leave(`user-${userId}`);
	});
});
