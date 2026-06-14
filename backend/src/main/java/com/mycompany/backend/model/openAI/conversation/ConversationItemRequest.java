package com.mycompany.backend.model.openAI.conversation;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConversationItemRequest {
    private String type;
    private String role;
    private String content;
}
