import { type FC, type PropsWithChildren, useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { SetSocketContext, SocketContext } from "./state";

type Props = {
	url: string;
};

const WebsocketProvider: FC<PropsWithChildren<Props>> = ({ children, url }) => {
	const [socket, setSocket] = useState<Socket | null>(null);

	useEffect(() => {
		const _socket = io(url, {
			// For authentication through token
			// auth: {
			// 	token: "SAMPLE_TOKEN_FOR_AUTHENTICATION",
			// },
			// or
			// auth: () => ({
			//   token: localStorage.getItem('authToken'),
			// })
			//
			// For authentication through httpOnly cookie, no additonal settings are required
		});

		_socket.on("connect", () => {
			console.log("[WebsocketProvider:connect] Connected to socket.io server");
			setSocket(_socket);
		});
		_socket.on("disconnect", () => {
			console.log(
				"[WebsocketProvider:disconnect] Disconnected from socket.io server",
			);
			setSocket(null);
		});
		_socket.on("error", (err) => {
			console.error(
				"[WebsocketProvider:error] Error connecting to socket.io server",
				err,
			);
		});
		_socket.on("connect_failed", (err) => {
			console.error(
				"[WebsocketProvider:connect_failed] Failed to connect to socket.io server",
				err,
			);
		});
		// See https://www.tutorialspoint.com/socket.io/socket.io_error_handling.htm
		// for other standard socket events

		return () => {
			setSocket(null);
			_socket.disconnect();
		};
	}, [url]);

	return (
		<SocketContext.Provider value={socket}>
			<SetSocketContext.Provider value={setSocket}>
				{children}
			</SetSocketContext.Provider>
		</SocketContext.Provider>
	);
};

export default WebsocketProvider;
