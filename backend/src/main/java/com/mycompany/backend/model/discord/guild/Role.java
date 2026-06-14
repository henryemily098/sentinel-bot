package com.mycompany.backend.model.discord.guild;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Role {
    private String id;
    private String name;
    private int color;
    private Colors colors;
    private boolean hoist;
    private String icon;
    private String unicode_emoji;
    private int position;
    private String permissions;
    private boolean managed;
    private boolean mentionable;
    private Tags tags;
    private int flags;
}
