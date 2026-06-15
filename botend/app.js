require("dotenv").config();
const fetch = require("node-fetch").default;
const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const listener = server.listen(process.env.PORT || 3002, () => console.log("[SERVER] Listen to port:", listener.address().port));

const {
    Client: SocketClient
} = require("@stomp/stompjs");
const SockJS = require("sockjs-client");
const {
    Client,
    Events,
    GatewayIntentBits,
    Partials,
    EmbedBuilder,
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

const colors = {
    1: "#FFFF00",
    2: "#FF0000",
    3: "#FFA500"
}
client.baseURL = process.env.BASE_URL;

client.on(Events.ClientReady, (readyClient) => console.log(`[SERVER] ${readyClient.user.username} it's ready!`));
client.on(Events.MessageCreate, async(message) => {
    try {
        if(message.author.id === client.user.id) return;
        let response = await fetch(`${client.baseURL}/violations/${message.guildId}/channels/${message.channelId}`, {
            method: "POST",
            headers: {
                'Authorization': client.token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: message.id,
                content: message.content,
                timestamp: message.createdTimestamp,
                userId: message.author.id
            })
        });
        let jsonResponse = await response.json();
        if(jsonResponse.violation.toLowerCase() === "no") return;

        let embed = new EmbedBuilder()
            .setColor(colors[jsonResponse.reason.level])
            .setAuthor({
                iconURL: message.author.displayAvatarURL({ size: 1024 }),
                name: `${message.author.username} has been warned!`
            })
            .setDescription(
                `**Reason:** ${jsonResponse.reason.category}`
            );
        await message.channel.send({
            embeds: [embed]
        });
    } catch (error) {
        console.log(error);
    }
});
client.login(process.env.TOKEN);


app.use(cors({
    origin: "http://localhost:3001",
    credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    if(!req.headers.authorization || req.headers.authorization !== "Bot " + process.env.TOKEN) return res.status(400).send({ message: "This area is porhibited!", code: 400 });
    next();
});

app.post("/guilds/:id/members", async(req, res) => {
    if(!client.isReady()) return res.status(503).send({ message: "Service it's not availabe yet!", code: 503 });
    let guild = client.guilds.cache.get(req.params.id);
    try {
        await guild.members.fetch();
    } catch (error) {}
    
    return res
        .status(200)
        .send(
            Array.isArray(req.body)
            ? req.body
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(i => {
                    i["user"] = guild.members.cache.get(i.userId)?.user;
                    return i;
                })
            : (() => {
                req.body["user"] = guild.members.cache.get(req.body.userId)?.user;
                return req.body;
            })()
        );
});

app.post("/guilds/:id/channels/:channelId/create-message", async(req, res) => {
    if(!client.isReady()) return;

    let { id, channelId } = req.params;
    let guild = client.guilds.cache.get(id);
    if(!guild) return;

    let channel = guild.channels.cache.get(channelId);
    if(!channel) return;
    try {
        let body = req.body;
        let user = client.users.cache.get(body.userId);
        let embed = new EmbedBuilder()
            .setColor(colors[body.level])
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL({ size: 1024 })
            })
            .setFields([
                {
                    name: "Username",
                    value: user.username,
                    inline: true
                },
                {
                    name: "ID",
                    value: user.id,
                    inline: true
                },
                {
                    name: "Date",
                    value: `${new Date(body.timestamp).toLocaleString()}`,
                    inline: true
                },
                {
                    name: "Level",
                    value: `${body.level}`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: body.reason,
                    inline: true
                },
                {
                    name: "Location",
                    value: `[Click here](https://discord.com/channels/${id}/${body.channelId}/${body.messageId})`,
                    inline: true
                }
            ]);
        await channel.send({
            embeds: [embed]
        });
    } catch (error) {
        console.log(error);
    }
    return res.sendStatus(204);
});