package com.mycompany.backend.model.openAI.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Request {
    private String model = "gpt-5.4-mini";
    private Conversation conversation;
    private String input;

    public void setConversationId(String conversationId)
    {
        Conversation conversation = new Conversation();
        conversation.setId(conversationId);
        this.conversation = conversation;
    }
}
