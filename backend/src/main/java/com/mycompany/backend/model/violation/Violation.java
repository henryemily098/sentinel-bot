package com.mycompany.backend.model.violation;

import com.mycompany.backend.model.discord.guild.Member;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;
import java.util.Date;

@Entity
@Table(name = "violations")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "level", discriminatorType = DiscriminatorType.INTEGER)
@Getter
@Setter
public abstract class Violation implements ViolationInterface {
    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @Value("${discordBot.token}")
    @Transient
    private String clientToken;

    @Id
    @Column(name = "id", unique = true, length = 500)
    private String id;

    @Column(name = "guildId", length = 500)
    private String guildId;

    @Column(name = "userId", length = 500)
    private String userId;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "action")
    private int action;

    @Column(name = "timestamp")
    private long timestamp;

    public Violation(String userId, String guildId, String reason)
    {
        this.userId = userId;
        this.guildId = guildId;
        this.reason = reason;
        this.timestamp = new Date().getTime();
    }

    public Member getMember()
    {
        RestClient rs = RestClient.create();
        Member member = null;
        try {
            member = rs.get()
                    .uri("https://discord.com/api/v10/guilds/" + this.guildId + "/members/" + this.userId)
                    .header("Authorization", "Bot " + this.clientToken)
                    .retrieve()
                    .body(Member.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return member;
    }

    public void kickMember()
    {
        try {
            RestClient rs = RestClient.create();
            rs.delete()
                    .uri("https://discord.com/api/v10/guilds/" + this.guildId + "/members/" + this.userId)
                    .header("Authorization", "Bot " + this.clientToken)
                    .retrieve();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void banMember()
    {
        try {
            RestClient rs = RestClient.create();
            rs.put()
                    .uri("https://discord.com/api/v10/guilds/" + this.guildId + "/bans/" + this.userId)
                    .header("Authorization", "Bot " + this.clientToken)
                    .retrieve();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void timeoutMember(int duration)
    {
        try {
            RestClient rs = RestClient.create();
            rs.patch()
                    .uri("https://discord.com/api/v10/guilds/" + this.guildId + "/members/" + this.userId)
                    .header("Authorization", "Bot " + this.clientToken)
                    .retrieve();
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}