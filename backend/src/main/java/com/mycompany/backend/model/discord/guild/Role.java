package com.mycompany.backend.model.discord.guild;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class Colors {
    private int primary_color;
    private int secondary_color;
    private int tertiary_color;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class Tags {
    private String bot_id;
    private String integration_id;
    private Object premium_subscriber;
    private String subscription_listing_id;
    private Object available_for_purchase;
    private Object guild_connections;
}

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
