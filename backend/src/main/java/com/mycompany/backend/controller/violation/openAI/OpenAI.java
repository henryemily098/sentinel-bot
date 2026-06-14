package com.mycompany.backend.controller.violation.openAI;

import com.mycompany.backend.model.openAI.conversation.*;
import com.mycompany.backend.model.openAI.item.*;
import com.mycompany.backend.model.openAI.response.*;
import org.springframework.core.io.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

public class OpenAI extends BaseOpenAI {
    public OpenAI(String apiKey, String conversationEndpoint, String responseEndpoint) {
        super(apiKey, conversationEndpoint, responseEndpoint);
    }

    public ConversationResponse createConversation() throws Exception
    {
        String earlyTraining = this.getEarlyTrainingFile();
        if(earlyTraining == null) return null;

        Map<String, String> metadata = new HashMap<>();
        ArrayList<ConversationItemRequest> itemsRequest = new ArrayList<>();

        metadata.put("topic", "Receiving message from Discord");
        ConversationItemRequest item = new ConversationItemRequest();
        item.setContent(earlyTraining);
        item.setRole("developer");
        item.setType("message");
        itemsRequest.add(item);

        ConversationRequest request = new ConversationRequest();
        request.setMetadata(metadata);
        request.setItems(itemsRequest);
        return this.conversation(request);
    }

    public ConversationResponse getConversation(String id) throws Exception {
        return this.conversation(id, "get");
    }

    public ConversationResponse deleteConversation(String id) throws Exception {
        return this.conversation(id, "delete");
    }

    public ItemResponse addItemToConversation(String id, ItemRequest body) throws Exception
    {
        return this.item(id, body);
    }

    public ItemRes getItemFromConversation(String conversationId, String itemId) throws Exception
    {
        return this.item(conversationId, itemId);
    }

    public Response createResponse(String conversationId, String message) throws Exception
    {
        return this.response(conversationId, message);
    }

    private String getEarlyTrainingFile()
    {
        try {
            ResourceLoader resourceLoader = new DefaultResourceLoader();
            Resource resource = resourceLoader.getResource("classpath:early-training.txt");
            BufferedReader reader = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)
            );
            return reader.lines().collect(Collectors.joining("\n"));
        } catch(Exception err) {
            err.printStackTrace();
            return null;
        }
    }
}
