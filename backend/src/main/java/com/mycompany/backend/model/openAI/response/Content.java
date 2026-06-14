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
public class Content {
    private String type;
    private String text;
    private ArrayList<Annotation> annotations;
    private ArrayList<Logprobs> logprobs;
}
