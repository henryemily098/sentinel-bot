package com.mycompany.backend.model.openAI.item;

import lombok.*;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemReq {
    private String type;
    private String role;
    private ArrayList<Map<String, String>> content;
}
