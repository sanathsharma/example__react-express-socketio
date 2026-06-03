import { WEBSOCKET_URL } from "./config";
import { useWebsocket } from "./websockets/state";
import useWebsocketListener from "./websockets/useWebsocketListener";
import WebsocketProvider from "./websockets/WebsocketProvider";

const InnerApp = () => {
	const socket = useWebsocket();
	console.log("[InnerApp] Socket: ", socket);

	useWebsocketListener("receive_message", (data) => {
		console.log("Message received:", data);
	});

	return (
		<button
			type="button"
			onClick={() => socket?.emit("send_message", "Hello World")}
		>
			Send Message
		</button>
	);
};

const App = () => {
	return (
		<WebsocketProvider url={WEBSOCKET_URL}>
			Open console to see messages
			<br />
			<InnerApp />
		</WebsocketProvider>
	);
};

export default App;
