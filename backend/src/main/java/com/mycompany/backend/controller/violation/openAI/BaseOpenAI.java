package com.mycompany.backend.controller.violation.openAI;

import com.mycompany.backend.model.openAI.conversation.*;
import com.mycompany.backend.model.openAI.item.*;
import com.mycompany.backend.model.openAI.response.*;
import lombok.*;
import org.springframework.web.client.RestClient;

import java.util.Optional;

@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseOpenAI {
    private final RestClient rs = RestClient.create();

    private String apiKey;
    private String conversationEndpoint;
    private String responseEndpoint;

    protected ConversationResponse conversation(ConversationRequest body) throws Exception
    {
        ConversationResponse response = null;
        try {
            response = this.rs.post()
                    .uri(this.conversationEndpoint)
                    .header("Authorization", "Bearer " + this.apiKey)
                    .header("Content-Type", "application/json")
                    .body(body)
                    .retrieve()
                    .body(ConversationResponse.class);
        } catch (Exception err) {
            throw new Exception(err.getMessage());
        }
        return response;
    }

    protected ConversationResponse conversation(String conversationId, String doWhat) throws Exception
    {
        ConversationResponse response = null;
        try {
            if(doWhat != null && doWhat.equals("delete"))
            {
                response = this.rs.delete()
                        .uri(this.conversationEndpoint + "/" + conversationId)
                        .header("Authorization", "Bearer " + this.apiKey)
                        .retrieve()
                        .body(ConversationResponse.class);
            }
            else
            {
                response = this.rs.get()
                        .uri(this.conversationEndpoint + "/" + conversationId)
                        .header("Authorization", "Bearer " + this.apiKey)
                        .retrieve()
                        .body(ConversationResponse.class);
            }
        } catch (Exception err) {
            throw new Exception(err.getMessage());
        }
        return response;
    }

    protected ConversationResponse conversation(String conversationId, ConversationRequest body) throws Exception
    {
        ConversationResponse response = null;
        try {
            response = this.rs.post()
                    .uri(this.conversationEndpoint + "/" + conversationId)
                    .header("Authorization", "Bearer " + this.apiKey)
                    .header("Content-Type", "application/json")
                    .body(body)
                    .retrieve()
                    .body(ConversationResponse.class);
        } catch (Exception err) {
            throw new Exception(err.getMessage());
        }
        return response;
    }

    protected ItemResponse item(String conversationId, ItemRequest body) throws Exception
    {
        ItemResponse response = null;
        try {
            response = this.rs.post()
                    .uri(this.conversationEndpoint + "/" + conversationId + "/items")
                    .header("Authorization", "Bearer " + this.apiKey)
                    .header("Content-Type","application/json")
                    .body(body)
                    .retrieve()
                    .body(ItemResponse.class);
        } catch (Exception err) {
            throw new Exception(err.getMessage());
        }
        return response;
    }

    protected ItemRes item(String conversationId, String itemId) throws Exception
    {
        ItemRes response = null;
        try {
            response = this.rs.get()
                    .uri(this.conversationEndpoint + "/" + conversationId + "/items/" + itemId)
                    .header("Authorization", "Bearer " + this.apiKey)
                    .retrieve()
                    .body(ItemRes.class);
        } catch (Exception err) {
            throw new Exception(err.getMessage());
        }
        return response;
    }

    protected ItemResponse item(String conversationId) throws Exception
    {
        ItemResponse response = null;
        try {
            response = this.rs.get()
                    .uri(this.conversationEndpoint + "/" + conversationId + "/items")
                    .header("Authorization", "Bearer " + this.apiKey)
                    .retrieve()
                    .body(ItemResponse.class);
        } catch (Exception err) {
            throw new Exception(err.getMessage());
        }
        return response;
    }

    protected Response response(String conversationId, String message) throws Exception
    {
        Response res = null;
        try {
            Request request = new Request();
            request.setConversationId(conversationId);
            request.setInput(message);
            request.setModel("gpt-5.4-mini");

            res = this.rs.post()
                    .uri(this.responseEndpoint)
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + this.apiKey)
                    .body(request)
                    .retrieve()
                    .body(Response.class);
        } catch (Exception err) {
            throw new Exception(err.getMessage());
        }
        return res;
    }


}
