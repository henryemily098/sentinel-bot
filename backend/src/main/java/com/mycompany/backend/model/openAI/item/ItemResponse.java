package com.mycompany.backend.model.openAI.item;

import lombok.*;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponse {
    private String object;
    private ArrayList<ItemRes> data;
    private String first_id;
    private String last_id;
    private boolean has_more;
}
