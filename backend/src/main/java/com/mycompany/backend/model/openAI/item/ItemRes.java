package com.mycompany.backend.model.openAI.item;

import lombok.*;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemRes {
    private String type;
    private String id;
    private String status;
    private String role;
    private ArrayList<Map<String, String>> content;
}
