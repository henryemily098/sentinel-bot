package com.mycompany.backend.model.openAI.item;

import lombok.*;

import java.util.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequest {
    private ArrayList<ItemReq> items;
}
