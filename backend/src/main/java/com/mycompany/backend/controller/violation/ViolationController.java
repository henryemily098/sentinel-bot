package com.mycompany.backend.controller.violation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.mycompany.backend.controller.violation.openAI.OpenAI;
import com.mycompany.backend.model.*;
import com.mycompany.backend.model.discord.guild.Message;
import com.mycompany.backend.model.openAI.Output;
import com.mycompany.backend.model.openAI.Reason;
import com.mycompany.backend.model.openAI.conversation.ConversationResponse;
import com.mycompany.backend.model.openAI.item.*;
import com.mycompany.backend.model.openAI.response.Response;
import com.mycompany.backend.model.violation.*;
import com.mycompany.backend.repository.*;
import lombok.*;
import org.springframework.beans.factory.annotation.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClient;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class ErrorResponse {
    private String message;
    private HttpStatus status;
}

@RestController
@RequestMapping("/violations")
public class ViolationController extends BaseViolationController {
    @GetMapping("/{id}")
    public ResponseEntity<?> handleViolation(@PathVariable("id") String serverId, @RequestHeader("Authorization") String authorization)
    {
        OpenAI openAI = new OpenAI(this.getApiKey(), "https://api.openai.com/v1/conversations", "https://api.openai.com/v1/responses");
        if(authorization == null || !authorization.equals(this.getToken())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("This area is forbidden for user!", HttpStatus.FORBIDDEN));
        try {
            List<Conversation> conversations = this.getConversationRepo().findAllConversationByGuildId(serverId);
            for(int i = 0; i < conversations.size(); i++)
            {
                ConversationResponse conversationResponse = openAI.getConversation(conversations.get(i).getId());
                if(conversationResponse == null) this.getConversationRepo().delete(conversations.get(i));
            }
            return ResponseEntity.status(HttpStatus.OK).body(conversations);
        } catch (Exception err) {
            err.printStackTrace();
            ErrorResponse error = new ErrorResponse(err.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            return ResponseEntity.status(error.getStatus()).body(error);
        }
    }

    @GetMapping("/{id}/channels/{channelId}")
    public ResponseEntity<?> handleViolationChannel(@PathVariable("id") String serverId, @PathVariable("channelId") String channelId, @RequestHeader("Authorization") String authorization)
    {
        if(authorization == null || !authorization.equals(this.getToken())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("This area is forbidden for user!", HttpStatus.FORBIDDEN));
        try {
            Conversation conversation = this.getConversationRepo().findConversationByGuildIdAndChannelId(serverId, channelId).orElse(null);
            ErrorResponse error = new ErrorResponse("Data not found", HttpStatus.NOT_FOUND);
            return ResponseEntity.status(conversation == null ? error.getStatus() : HttpStatus.OK).body(conversation == null ? error : conversation);
        } catch (Exception err) {
            err.printStackTrace();
            ErrorResponse error = new ErrorResponse(err.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            return ResponseEntity.status(error.getStatus()).body(error);
        }
    }

    @PostMapping("/{id}/channels/{channelId}")
    public ResponseEntity<?> handleAddViolationChannel(@PathVariable("id") String serverId, @PathVariable("channelId") String channelId, @RequestHeader("Authorization") String authorization, @RequestBody Message message)
    {
        OpenAI openAI = new OpenAI(this.getApiKey(), "https://api.openai.com/v1/conversations", "https://api.openai.com/v1/responses");
        if(authorization == null || !authorization.equals(this.getToken())) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new ErrorResponse("This area is forbidden for user!", HttpStatus.FORBIDDEN));

        // BADWORDS DETECTION
        boolean hasBadwords = false;
        Badwords badwords = this.getBadwordListRepo().findBadwordListById(serverId).orElse(null);
        if(badwords != null) hasBadwords = badwords.isBadwordsInMessage(message.getContent());

        // AI DETECTION
        try {
            Conversation conversation = this.getConversationRepo().findConversationByGuildIdAndChannelId(serverId, channelId).orElse(null);
            if(conversation == null)
            {
                ConversationResponse conversationResponse = openAI.createConversation();
                conversation = new Conversation();
                conversation.setId(conversationResponse.getId());
                conversation.setGuildId(serverId);
                conversation.setChannelId(channelId);
                conversation.setLimitMessage(15);
                conversation.setCount(0);
            }
            else
            {
                ConversationResponse conversationResponse = openAI.getConversation(conversation.getId());
                if(conversationResponse == null)
                {
                    conversationResponse = openAI.createConversation();
                    conversation.setId(conversationResponse.getId());
                    conversation.setCount(0);
                }
            }

            Map<String, String> content = new HashMap<>();
            content.put("type", "input_text");
            content.put("text", message.getUserId() + " - " + message.getId() + (hasBadwords ? " (badwords)" : "") + ": " + message.getContent());

            ArrayList<Map<String, String>> contents = new ArrayList<>();
            contents.add(content);

            ItemReq itemReq = new ItemReq();
            itemReq.setContent(contents);
            itemReq.setType("message");
            itemReq.setRole("user");

            ArrayList<ItemReq> items = new ArrayList<>();
            items.add(itemReq);

            ItemRequest itemRequest = new ItemRequest();
            itemRequest.setItems(items);

            openAI.addItemToConversation(conversation.getId(), itemRequest);
            conversation.setCount(conversation.getCount() + 1);

            Output output = new Output();
            output.setViolation("no");
            output.setReason(null);
            output.setUserId(null);
            output.setMessageId(null);
            output.setTimestamp(0);

            if(hasBadwords && this.configurationCheck(serverId, "Racism/Badword"))
            {
                Reason reason = new Reason();
                reason.setLevel(1);
                reason.setCategory("Racism/Badword");

                output.setViolation("yes");
                output.setReason(reason);
                output.setUserId(message.getUserId());
                output.setMessageId(message.getId());
                output.setTimestamp(message.getTimestamp());
            }
            else
            {
                Response response = openAI.createResponse(conversation.getId(), "System: Do you find any suspicious action from these chats?");
                JsonObject object = JsonParser.parseString(response.getOutput().getFirst().getContent().getFirst().getText()).getAsJsonObject();

                if(object.get("violation").getAsString().equalsIgnoreCase("yes") && this.configurationCheck(serverId, object.get("reason").getAsJsonObject().get("category").getAsString()))
                {
                    Reason reason = new Reason();
                    reason.setLevel(object.get("reason").getAsJsonObject().get("level").getAsInt());
                    reason.setCategory(object.get("reason").getAsJsonObject().get("category").getAsString());

                    output.setViolation("yes");
                    output.setReason(reason);
                    output.setUserId(object.get("userId").getAsString());
                    output.setMessageId(object.get("messageId").getAsString());
                    output.setTimestamp(Date.from(Instant.now()).getTime());
                }
            }

            if(output.getViolation().equalsIgnoreCase("yes"))
            {
                Violation violation = null;
                if(output.getReason().getLevel() == 1) violation = new Minor();
                else if(output.getReason().getLevel() == 2) violation = new Medium();
                else if(output.getReason().getLevel() == 3) violation = new Major();

                violation.setId(UUID.randomUUID().toString());
                violation.setGuildId(serverId);
                violation.setUserId(output.getUserId());
                violation.setMessageId(output.getMessageId());
                violation.setReason(output.getReason().getCategory());
                violation.setChannelId(channelId);
                violation.setTimestamp(output.getTimestamp());

                if(violation != null)
                {
                    this.getViolationRepo().save(violation);
                    doAction(serverId, output.getUserId());

                    Map<String, Object> user = this.getRs()
                            .post()
                            .uri(this.getDiscordBotEndPoint() + "/guilds/" + serverId + "/members")
                            .header("Authorization", "Bot " + this.getToken())
                            .body(violation)
                            .retrieve()
                            .body(Map.class);
                    this.getTemplate().convertAndSend(
                            "/socket-response/logs/" + violation.getGuildId(),
                            user
                    );
                }
            }

            if(conversation.getCount() >= 15)
            {
                openAI.deleteConversation(conversation.getId());
                ConversationResponse conversationResponse = openAI.createConversation();
                conversation.setId(conversationResponse.getId());
                conversation.setCount(0);
            }
            this.getConversationRepo().save(conversation);
            return ResponseEntity.status(HttpStatus.OK).body(output);
        } catch (Exception err) {
            err.printStackTrace();
            ErrorResponse error = new ErrorResponse(err.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            return ResponseEntity.status(error.getStatus()).body(error);
        }
    }

    private boolean configurationCheck(String guildId, String category)
    {
        // “Grooming/Sexual Harassment” | “Phishing Link” | “Scamming” | “Racism/Badword”
        Configuration configuration = this.getConfigurationRepo().findConfigurationById(guildId).orElse(null);
        if(configuration == null)
        {
            configuration = new Configuration();
            configuration.setId(guildId);
            configuration.setBadwordsEnabled(true);
            configuration.setScammerDetected(true);
            configuration.setPhisingLinkDetected(true);
            configuration.setSaGroomingDetected(true);
            configuration.setLogChannelId(null);
            configuration.setPrefix("!");
            this.getConfigurationRepo().save(configuration);
        }

        if(category.equals("Grooming/Sexual Harassment") && configuration.isSaGroomingDetected()) return true;
        else if(category.equals("Phising Link") && configuration.isPhisingLinkDetected()) return true;
        else if(category.equals("Scamming") && configuration.isScammerDetected()) return true;
        else if(category.equals("Racism/Badword") && configuration.isBadwordsEnabled()) return true;
        else return false;
    }

    private void doAction(String guildId, String userId)
    {
        List<Violation> violations = this.getViolationRepo().findAllByUserId(userId);
        List<Action> actions = this.getActionRepo().findAllActionsByGuildId(guildId);

        int requirementCount = 0;
        for(int i = 0; i < violations.size(); i++)
        {
            if(violations.get(i) instanceof Minor) requirementCount = requirementCount + 1;
            else if(violations.get(i) instanceof Medium) requirementCount = requirementCount + 2;
            else if(violations.get(i) instanceof Major) requirementCount = requirementCount + 3;
        }
        final int count = requirementCount;

        Action action = actions.stream()
                .filter(a -> a.getRequirementCount() <= count)
                .sorted((a1, a2) -> {
                    int reqCompare = Integer.compare(a2.getRequirementCount(), a1.getRequirementCount());
                    if (reqCompare != 0) return reqCompare;

                    int priority1 = getActionPriority(a1.getAction());
                    int priority2 = getActionPriority(a2.getAction());
                    int priorityCompare = Integer.compare(priority1, priority2); // BAN (1) vs KICK (2) -> BAN duluan
                    if (priorityCompare != 0) return priorityCompare;

                    if ("timeout".equals(a1.getAction()) && "timeout".equals(a2.getAction())) {
                        return Long.compare(a2.getDuration(), a1.getDuration());
                    }
                    return 0;
                })
                .findFirst()
                .orElse(null);
        if(action == null) return;


        switch (action.getAction()) {
            case "timeout":
                this.timeout(guildId, userId, action.getDuration());
                break;
            case "kick":
                this.kick(guildId, userId);
                break;
            case "ban":
                this.ban(guildId, userId);
                break;
        }
    }

    private int getActionPriority(String type) {
        switch (type) {
            case "ban":     return 1; // Prioritas utama
            case "kick":    return 2;
            case "timeout": return 3; // Prioritas terakhir
            default:        return 4; // Pengaman jika ada tipe lain
        }
    }

    private void timeout(String guildId, String userId, long duration)
    {
        try {
            Instant timeoutEnd = Instant.now().plus(duration, ChronoUnit.MILLIS);
            String communicationDisabledUntil = timeoutEnd.toString();

            Map<String, Object> body = new HashMap<>();
            body.put("communication_disabled_until", communicationDisabledUntil);

            this.getRs().patch()
                    .uri(this.getDiscordAPI() + "/guilds/" + guildId + "/members/" + userId)
                    .header("Authorization", "Bot " + this.getToken())
                    .body(body)
                    .retrieve();
        } catch (Exception err) {
            err.printStackTrace();
        }
    }

    private void kick(String guildId, String userId)
    {
        try {
            this.getRs().delete()
                    .uri(this.getDiscordAPI() + "/guilds/" + guildId + "/members/" + userId)
                    .header("Authorization", "Bot " + this.getToken())
                    .retrieve();
        } catch (Exception err) {
            err.printStackTrace();
        }
    }

    private void ban(String guildId, String userId)
    {
        try {
            Map<String, Object> body = new HashMap<>();
            body.put("delete_message_seconds", 604800);
            this.getRs().put()
                    .uri(this.getDiscordAPI() + "/guilds/" + guildId + "/bans/" + userId)
                    .header("Authorization", "Bot " + this.getToken())
                    .body(body)
                    .retrieve();
        } catch (Exception err) {
            err.printStackTrace();
        }
    }
}
