package com.mycompany.backend.model.openAI.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Logprobs extends TopLogprobs {
    private ArrayList<TopLogprobs> top_logprobs;
}
