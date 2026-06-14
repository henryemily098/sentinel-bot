package com.mycompany.backend.model.openAI.conversation;

import lombok.*;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationRequest {
    private Map<String, String> metadata;
    private ArrayList<ConversationItemRequest> items;
}
