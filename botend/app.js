require("dotenv").config();
const fetch = require("node-fetch").default;
const {
    Client: SocketClient
} = require("@stomp/stompjs");
const SockJS = require("sockjs-client");
const {
    Client,
    Events,
    GatewayIntentBits,
    Partials,
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});

client.baseURL = process.env.BASE_URL;

const createSocketConnection = () => {
    const socket = new SocketClient({
        onStompError: (frame) => console.log("Error pada:", frame),
        reconnectDelay: 2500,
        webSocketFactory: () => new SockJS(client.baseURL + "/web-socket"),
    });
    socket.activate();
    client.socket = socket;
}
const refreshSessionId = async() => {
    try {
        let response = await fetch(`${client.baseURL}/auth/account/current-session`);
        client.sessionId = await response.text();
        createSocketConnection();
    } catch (error) {
        console.log(error);
    } finally {
        client.login(process.env.TOKEN);
    }
}
refreshSessionId();

client.on(Events.ClientReady, (readyClient) => console.log(`[SERVER] ${readyClient.user.username} it's ready!`));
client.on(Events.MessageCreate, (message) => {
    
});