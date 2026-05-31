package com.mycompany.backend.socketcontroller;

import com.mycompany.backend.model.Configuration;
import com.mycompany.backend.model.discord.guild.Member;
import com.mycompany.backend.repository.ConfigurationRepo;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class GuildMemberUpdate {
    private String nick;
    private String banner;
    private String avatar;
    private String bio;
}

@Controller
public class ConfigurationSocket extends BaseSocket {
    @Autowired
    private ConfigurationRepo repository;

    @MessageMapping("/configuration/{id}")
    @SendTo("/socket-response/configuration/{id}")
    public Configuration handleConfigurationInfo(@DestinationVariable String id, SimpMessageHeaderAccessor headerAccessor)
    {
        Optional<Configuration> configResponse = this.repository.findConfigurationById(id);
        Configuration configuration = null;
        Member member = (Member)headerAccessor.getSessionAttributes().get("clientMemberUser-" + id);

        if(member == null)
        {
            try {
                member = getMember(id, this.getClientId(), 0, 3);
                headerAccessor.getSessionAttributes().put("clientMemberUser-" + id, member);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

        if(configResponse.isPresent()) configuration = configResponse.get();
        else
        {
            configuration = new Configuration();
            configuration.setId(id);
            configuration.setBadwordsEnabled(true);
            configuration.setAISentivity(5);
            configuration.setSexualHarassmentDetected(true);
            configuration.setGroomingDetected(true);
            configuration.setScammerDetected(true);
            configuration.setOnlineGambleDetected(true);
            configuration.setPhisingLinkDetected(true);
            configuration.setLogChannelId(null);
            configuration.setPrefix("!");
            this.repository.save(configuration);
        }
        configuration.setNickname(member != null ? member.getNick() : null);
        return configuration;
    }

    @MessageMapping("/configuration/{id}/update")
    @SendTo("/socket-response/configuration/{id}/update")
    public Configuration handleConfigurationUpdate(@DestinationVariable String id, @Payload Configuration config, SimpMessageHeaderAccessor headerAccessor)
    {
        Member member = (Member)headerAccessor.getSessionAttributes().get("clientMemberUser-" + id);
        if(member == null)
        {
            try {
                member = getMember(id, this.getClientId(), 0, 3);
                headerAccessor.getSessionAttributes().put("clientMemberUser-" + id, member);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        if((member.getNick() == null && !config.getNickname().isEmpty()) || (member.getNick() != null && config.getNickname().isEmpty()) || (member.getNick() != null && !member.getNick().equals(config.getNickname())))
        {
            try {
                member = this.updateNicknameMember(id, config.getNickname().isEmpty() ? null : config.getNickname(), 0, 3);
                headerAccessor.getSessionAttributes().put("clientMemberUser-" + id, member);
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
