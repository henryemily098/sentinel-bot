package com.mycompany.backend.model.openAI;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Output {
    private String violation;
    private Reason reason;
    private String userId;
    private String messageId;
    private long timestamp;
}
