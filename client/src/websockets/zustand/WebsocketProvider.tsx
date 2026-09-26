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
			reconnection: true,
			reconnectionDelay: 1000,
			reconnectionAttempts: Infinity,
			reconnectionDelayMax: 5000,
			randomizationFactor: 0.5,
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
		socket.on("disconnect", (reason) => {
			console.log(
				`[WebsocketProvider:disconnect] Disconnected from socket.io server: ${reason}`,
			);
		});
		socket.on("error", (err) => {
			console.error(
				"[WebsocketProvider:error] Error connecting to socket.io server",
				err,
			);
		});
		socket.on("connect_error", (err) => {
			console.error(
				"[WebsocketProvider:connect_error] Failed to connect to socket.io server",
				err,
			);
		});
		socket.io.on("reconnect_attempt", (attempt) => {
			console.log(
				`[WebsocketProvider:reconnect_attempt] Reconnection attempt #${attempt}`,
			);
		});
		socket.io.on("reconnect", (attempt) => {
			console.log(
				`[WebsocketProvider:reconnect] Reconnected to socket.io server after ${attempt} attempt(s)`,
			);
		});
		socket.io.on("reconnect_error", (err) => {
			console.error(
				"[WebsocketProvider:reconnect_error] Reconnection attempt failed",
				err,
			);
		});
		socket.io.on("reconnect_failed", () => {
			console.error(
				"[WebsocketProvider:reconnect_failed] All reconnection attempts failed",
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
