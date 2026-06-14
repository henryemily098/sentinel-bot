package com.mycompany.backend.controller.violation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.backend.repository.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.client.RestClient;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseViolationController {
    private final RestClient rs = RestClient.create();
    private final String discordAPI = "https://discord.com/api/v10";

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ViolationRepo violationRepo;

    @Autowired
    private BadwordListRepo badwordListRepo;

    @Autowired
    private ConversationRepo conversationRepo;

    @Autowired
    private ConfigurationRepo configurationRepo;

    @Autowired
    private ActionRepo actionRepo;

    @Autowired
    private SimpMessagingTemplate template;

    @Value("${discordBot.token}")
    private String token;

    @Value("${openAI.apiKey}")
    private String apiKey;

    @Value("${discordBot.baseURL}")
    private String discordBotEndPoint;
}