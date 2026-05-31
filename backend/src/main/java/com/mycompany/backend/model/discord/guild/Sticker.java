package com.mycompany.backend.model.discord.guild;

import com.mycompany.backend.model.discord.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Sticker {
    private String id;
    private String pack_id;
    private String name;
    private String description;
    private String tags;
    private int type;
    private int format_type;
    private boolean available;
    private String guild_id;
    private User user;
    private int sort_value;
}
