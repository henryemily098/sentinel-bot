package com.mycompany.backend.model.discord;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
    private String id;
    private String name;
    private boolean moderated;
    private String emoji_id;
    private String emoji_name;
}
