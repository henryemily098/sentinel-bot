package com.mycompany.backend.model.discord.guild;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tags {
    private String bot_id;
    private String integration_id;
    private Object premium_subscriber;
    private String subscription_listing_id;
    private Object available_for_purchase;
    private Object guild_connections;
}
