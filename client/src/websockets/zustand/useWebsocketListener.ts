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

		socket.on(eventName, (data) => {
			callbackRef.current?.(data);
		});

		return () => {
			socket.off(eventName);
		};
	}, [eventName, socket]);
};

export default useWebsocketListener;
