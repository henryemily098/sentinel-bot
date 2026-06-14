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
public class Output {
    private String type;
    private String id;
    private String status;
    private String role;
    private ArrayList<Content> content;
    private String phase;
}
