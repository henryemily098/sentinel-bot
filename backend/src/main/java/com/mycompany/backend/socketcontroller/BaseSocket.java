package com.mycompany.backend.socketcontroller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;

public abstract class BaseSocket implements SocketInterface {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Value("${server.baseURL}")
    private String baseURL;

    @Value("${discordBot.clientId}")
    private String clientId;

    @Value("${discordBot.token}")
    private String clientToken;

    public SimpMessagingTemplate getMessageTemplate()
    {
        return this.messagingTemplate;
    }

    public String getDiscordBaseURL()
    {
        return "https://discord.com/api/v10";
    }

    public String getBaseURL()
    {
        return this.baseURL.equals("http://localhost:3000") ? "http://localhost:3001" : this.baseURL;
    }

    public String getClientId()
    {
        return this.clientId;
    }
    public String getClientToken()
    {
        return this.clientToken;
    }
}
