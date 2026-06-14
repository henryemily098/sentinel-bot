package com.mycompany.backend.socketcontroller;

import com.mycompany.backend.configuration.DiscordCacheService;
import com.mycompany.backend.model.Subscriptions;
import com.mycompany.backend.model.authentication.Guild;
import com.mycompany.backend.repository.SubscriptionsRepo;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestClient;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class GuildBody {
    private String username;
    private String email;
    private long time;
    private String paymentMethod;
}

@Controller
public class SubscriptionsSocket extends BaseSocket {
    @Autowired
    private SubscriptionsRepo repository;

    @Autowired
    private DiscordCacheService discordCacheService;

    @MessageMapping("/{sessionId}/subscriptions/{userId}")
    @SendTo("/socket-response/{sessionId}/subscriptions/{userId}")
    public List<Subscriptions> handleSubscriptionsList(@DestinationVariable String sessionId, @DestinationVariable String userId)
    {
        List<Subscriptions> subscriptionsList = this.repository.findAllSubscriptionsByOwnerId(userId);
        Guild[] guilds = (Guild[])discordCacheService.getDiscordItem(sessionId + "-guilds");
        if(guilds == null)
        {
            try {
                guilds = this.getClientGuilds(0, 3);
                discordCacheService.setDiscordItem(sessionId + "-guilds", guilds);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        long currDate = new Date().getTime();
        for(int i = 0; i < subscriptionsList.size(); i++)
        {
            if(subscriptionsList.get(i).getEndTimestamp() >= currDate)
            {
                boolean joined = false;
                for(int j = 0; j < guilds.length && !joined; j++)
                {
                    if(subscriptionsList.get(i).getId().equals(guilds[j].getId())) joined = true;
                }
                subscriptionsList.get(i).setJoined(joined);
                this.repository.save(subscriptionsList.get(i));
            }
            else this.repository.delete(subscriptionsList.get(i));
        }
        return subscriptionsList;
    }

    @MessageMapping("/{sessionId}/subscriptions/{userId}/get/{guildId}")
    @SendTo("/socket-response/{sessionId}/subscriptions/{userId}/get/{guildId}")
    public Subscriptions handleSubscriptionsList(@DestinationVariable String sessionId, @DestinationVariable String userId, @DestinationVariable String guildId)
    {
        Subscriptions subsGuild = null;
        long currDate = new Date().getTime();
        Optional<Subscriptions> responseSubsGuild = this.repository.findSubscriptionsById(guildId);

        if(responseSubsGuild.isPresent())
        {
            subsGuild = responseSubsGuild.get();
            if(subsGuild.getEndTimestamp() < currDate)
            {
                this.repository.delete(subsGuild);
                subsGuild = null;
            }
        }
        return subsGuild;
    }

    @MessageMapping("/{sessionId}/subscriptions/{userId}/add/{guildId}")
    @SendTo("/socket-response/{sessionId}/subscriptions/{userId}/add/{guildId}")
    public String handleSubscriptionsAdd(@DestinationVariable String sessionId, @DestinationVariable String userId, @DestinationVariable String guildId, @Payload GuildBody body)
    {
        Subscriptions subsGuild = this.repository.findSubscriptionsById(guildId).orElse(null);
        try {
            if(subsGuild == null)
            {
                long currDate = new Date().getTime();
                subsGuild = new Subscriptions();
                subsGuild.setId(guildId);
                subsGuild.setStartTimestamp(currDate);
                subsGuild.setEndTimestamp(currDate + body.getTime());
                subsGuild.setOwnerId(userId);
            }
            else subsGuild.setEndTimestamp(subsGuild.getEndTimestamp() + body.getTime());
            this.repository.save(subsGuild);
            return this.getBaseURL() + "/auth/login?server_id=" + guildId + "&guild=1";
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @MessageMapping("/{sessionId}/subscriptions/{userId}/replace/{replaceGuildId}")
    @SendTo("/socket-response/{sessionId}/subscriptions/{userId}/replace/{replaceGuildId}")
    public String handleSubscriptionsReplace(@DestinationVariable String sessionId, @DestinationVariable String userId, @DestinationVariable String replaceGuildId, @Payload String guildId)
    {
        Subscriptions subsGuild = this.repository.findSubscriptionsById(replaceGuildId).orElse(null);
        try {
            if(subsGuild != null)
            {
                this.repository.delete(subsGuild);
                subsGuild.setId(guildId);
                this.repository.save(subsGuild);
                return this.getBaseURL() + "/auth/login?server_id=" + guildId + "&guild=1";
            }
            else return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private Guild[] getClientGuilds(int retry, int retryLimit) throws Exception
    {
        if(retry == retryLimit) throw new Exception("Retry limit!");

        RestClient rs = RestClient.create();
        try {
            return rs.get()
                    .uri(this.getDiscordBaseURL() + "/users/@me/guilds")
                    .header("Authorization", "Bot " + this.getClientToken())
                    .retrieve()
                    .body(Guild[].class);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                Thread.sleep(2000);
            } catch (Exception err) {
                Thread.currentThread().interrupt();
            }
            return getClientGuilds(retry+1, retryLimit);
        }
    }
}