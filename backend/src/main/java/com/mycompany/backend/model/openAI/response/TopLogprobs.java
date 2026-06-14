package com.mycompany.backend.model.openAI.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TopLogprobs {
    private String token;
    private int[] bytes;
    private int logprob;
}
