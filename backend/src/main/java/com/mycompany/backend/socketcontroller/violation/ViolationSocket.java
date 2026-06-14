package com.mycompany.backend.socketcontroller.violation;

import com.mycompany.backend.model.violation.Violation;
import com.mycompany.backend.repository.ViolationRepo;
import com.mycompany.backend.socketcontroller.BaseSocket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;


@Controller
public class ViolationSocket extends BaseSocket implements ViolationSocketInterface {
    private final RestClient rs = RestClient.create();

    @Autowired
    private ViolationRepo repository;

    @Value("${discordBot.baseURL}")
    private String discordBotEndPoint;

    @Override
    @MessageMapping("/{sessionId}/violations/{guildId}")
    @SendTo("/socket-response/{sessionId}/violations/{guildId}")
    public List<Map<String, Object>> handleViolationList(@DestinationVariable String sessionId, @DestinationVariable String guildId)
    {
        try {
            List<Violation> violations = this.repository.findTop100ByGuildIdOrderByTimestamp(guildId);
            return rs.post()
                    .uri(discordBotEndPoint + "/guilds/" + guildId + "/members")
                    .header("Authorization", "Bot " + this.getClientToken())
                    .body(violations)
                    .retrieve()
                    .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
        } catch (Exception err) {
            err.printStackTrace();
            return null;
        }
    }
}