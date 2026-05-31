package com.mycompany.backend.socketcontroller;

import com.mycompany.backend.model.discord.*;
import com.mycompany.backend.model.discord.guild.Guild;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestClient;

@Getter
@Controller
public class DiscordSocket extends BaseSocket {
    @Value("${discordBot.token}")
    private String clientToken;

    @MessageMapping("/guilds/{id}")
    @SendTo("/socket-response/guilds/{id}")
    public Guild handleServerInfo(@DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor)
    {
        Guild guild = (Guild)headerAccessor.getSessionAttributes().get(id);
        if(guild == null)
        {
            try {
                guild = this.getGuild(id, 0, 3);
                headerAccessor.getSessionAttributes().put(id, guild);
            } catch (Exception err) {
                err.printStackTrace();
            }
        }
        return guild;
    }

    @MessageMapping("/guilds/{id}/channels")
    @SendTo("/socket-response/guilds/{id}/channels")
    public Channel[] handleChannelsInfo(@DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor)
    {
        Channel[] channels = (Channel[])headerAccessor.getSessionAttributes().get(id + "-channels");
        if(channels == null)
        {
            try {
                channels = this.getGuildChannels(id, 0, 3);
                headerAccessor.getSessionAttributes().put(id + "-channels", channels);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return channels;
    }

    private Guild getGuild(String id, int retry, int retryLimit) throws Exception
    {
        if(retry == retryLimit) throw new Exception("Retry limit!");

        RestClient rs = RestClient.create();
        Guild guild = null;
        try {
            guild = rs.get()
                    .uri(this.getDiscordBaseURL() + "/guilds/" + id + "?with_counts=true")
                    .header("Authorization", "Bot " + this.clientToken)
                    .retrieve()
                    .body(Guild.class);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                Thread.sleep(2000);
            } catch (Exception err) {
                Thread.currentThread().interrupt();
            }
            return getGuild(id, retry+1, retryLimit);
        }
        return guild;
    }

    private Channel[] getGuildChannels(String id, int retry, int retryLimit) throws Exception
    {
        if(retry == retryLimit) throw new Exception("Retry limit!");

        RestClient rs = RestClient.create();
        Channel[] channels = null;
        try {
            channels = rs.get()
                    .uri(this.getDiscordBaseURL() + "/guilds/" + id + "/channels")
                    .header("Authorization", "Bot " + this.clientToken)
                    .retrieve()
                    .body(Channel[].class);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                Thread.sleep(2000);
            } catch (Exception err) {
                Thread.currentThread().interrupt();
            }
            return getGuildChannels(id, retry+1, retryLimit);
        }
        return channels;
    }
}
