package com.mycompany.backend.model.discord.guild;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Message {
    private String id;
    private String content;
    private long timestamp;
    private String userId;
}
