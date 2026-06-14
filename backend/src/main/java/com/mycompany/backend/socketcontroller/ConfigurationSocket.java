package com.mycompany.backend.socketcontroller;

import com.mycompany.backend.configuration.DiscordCacheService;
import com.mycompany.backend.model.Configuration;
import com.mycompany.backend.model.discord.guild.*;
import com.mycompany.backend.repository.ConfigurationRepo;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestClient;

@Controller
public class ConfigurationSocket extends BaseSocket {
    @Autowired
    private DiscordCacheService discordCacheService;

    @Autowired
    private ConfigurationRepo repository;

    @MessageMapping("/{sessionId}/configuration/{id}")
    @SendTo("/socket-response/{sessionId}/configuration/{id}")
    public Configuration handleConfigurationInfo(@DestinationVariable String sessionId, @DestinationVariable String id)
    {
        String key = sessionId + "-" + id + "-" + "-me";
        Configuration configuration = this.repository.findConfigurationById(id).orElse(null);
        Member member = (Member)discordCacheService.getDiscordItem(key);

        if(member == null)
        {
            try {
                member = getMember(id, this.getClientId(), 0, 3);
                discordCacheService.setDiscordItem(key, member);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if(configuration == null)
        {
            configuration = new Configuration();
            configuration.setId(id);
            configuration.setBadwordsEnabled(true);
            configuration.setScammerDetected(true);
            configuration.setPhisingLinkDetected(true);
            configuration.setSaGroomingDetected(true);
            configuration.setLogChannelId(null);
            configuration.setPrefix("!");
            this.repository.save(configuration);
        }
        configuration.setNickname(member != null ? member.getNick() : null);
        return configuration;
    }

    @MessageMapping("/{sessionId}/configuration/{id}/update")
    @SendTo("/socket-response/{sessionId}/configuration/{id}/update")
    public Configuration handleConfigurationUpdate(@DestinationVariable String sessionId, @DestinationVariable String id, @Payload Configuration config)
    {
        String key = sessionId + "-" + id + "-" + "-me";
        Member member = (Member)discordCacheService.getDiscordItem(key);
        if(member == null)
        {
            try {
                member = getMember(id, this.getClientId(), 0, 3);
                discordCacheService.setDiscordItem(key, member);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if((member.getNick() == null && !config.getNickname().isEmpty()) || (member.getNick() != null && config.getNickname().isEmpty()) || (member.getNick() != null && !member.getNick().equals(config.getNickname()))) {
            try {
                member = this.updateNicknameMember(id, config.getNickname().isEmpty() ? null : config.getNickname(), 0, 3);
                discordCacheService.setDiscordItem(key, member);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        this.repository.save(config);
        return config;
    }

    private Member updateNicknameMember(String guildId, String nickname, int retry, int retryLimit) throws Exception
    {
        if(retry == retryLimit) throw new Exception("Retry limit!");

        RestClient rs = RestClient.create();
        try {
            GuildMemberUpdate memberUpdate = new GuildMemberUpdate();
            memberUpdate.setNick(nickname);
            return rs.patch()
                    .uri(this.getDiscordBaseURL() + "/guilds/" + guildId + "/members/@me")
                    .header("Authorization", "Bot " + this.getClientToken())
                    .body(memberUpdate)
                    .retrieve()
                    .body(Member.class);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                Thread.sleep(2000);
            } catch (Exception err) {
                Thread.currentThread().interrupt();
            }
            return updateNicknameMember(guildId, nickname, retry+1, retryLimit);
        }
    }

    private Member getMember(String guildId, String userId, int retry, int retryLimit) throws Exception
    {
        if(retry == retryLimit) throw new Exception("Retry limit!");

        RestClient rs = RestClient.create();
        Member member = null;
        try {
            member = rs.get()
                    .uri(this.getDiscordBaseURL() + "/guilds/" + guildId + "/members/" + userId)
                    .header("Authorization", "Bot " + this.getClientToken())
                    .retrieve()
                    .body(Member.class);
        } catch (Exception e) {
            e.printStackTrace();
            try {
                Thread.sleep(2000);
            } catch (Exception err) {
                Thread.currentThread().interrupt();
            }
            return getMember(guildId, userId, retry+1, retryLimit);
        }
        return member;
    }
}
