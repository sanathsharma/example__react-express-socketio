import { type FC, type PropsWithChildren, useEffect } from "react";
import { io } from "socket.io-client";
import { useSetWebsocket } from "./state";

type Props = {
	url: string;
};

const WebsocketProvider: FC<PropsWithChildren<Props>> = ({ children, url }) => {
	const setSocket = useSetWebsocket();

	useEffect(() => {
		const socket = io(url, {
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

		socket.on("connect", () => {
			console.log("[WebsocketProvider:connect] Connected to socket.io server");
			setSocket(socket);
		});
		socket.on("disconnect", () => {
			console.log(
				"[WebsocketProvider:disconnect] Disconnected from socket.io server",
			);
			setSocket(null);
		});
		socket.on("error", (err) => {
			console.error(
				"[WebsocketProvider:error] Error connecting to socket.io server",
				err,
			);
		});
		socket.on("connect_failed", (err) => {
			console.error(
				"[WebsocketProvider:connect_failed] Failed to connect to socket.io server",
				err,
			);
		});
		// See https://www.tutorialspoint.com/socket.io/socket.io_error_handling.htm
		// for other standard socket events

		return () => {
			setSocket(null);
			socket.disconnect();
		};
	}, [url, setSocket]);

	return <>{children}</>;
};

export default WebsocketProvider;
