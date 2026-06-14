package com.mycompany.backend.model.openAI.conversation;

import lombok.*;

import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private String id;
    private String object;
    private long created_at;
    private Map<String, String> metadata;
    private boolean deleted;
}
