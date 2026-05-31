import {
    Client
} from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function createWebSocket(baseURL) {
    const socket = new SockJS(baseURL);
    const client = new Client({
        onStompError: (frame) => console.log("Error pada:", frame),
        reconnectDelay: 2500,
        webSocketFactory: () => socket,
    });
    client.activate();
    return client;
}