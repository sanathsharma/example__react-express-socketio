import { useEffect, useRef } from "react";
import { useWebsocket } from "./state";

const useWebsocketListener = <Data = unknown>(
	eventName: string,
	callback: (data: Data) => void,
) => {
	const socket = useWebsocket();

	const callbackRef = useRef(callback);
	useEffect(() => {
		callbackRef.current = callback;
	}, [callback]);

	useEffect(() => {
		if (!socket) {
			return;
		}

		const handler = (data: Data) => {
			callbackRef.current?.(data);
		};
		socket.on(eventName, handler);

		return () => {
			socket.off(eventName, handler);
		};
	}, [eventName, socket]);
};

export default useWebsocketListener;
