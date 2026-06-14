package com.mycompany.backend.model.discord.guild;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WelcomeScreenChannel {
    private String channel_id;
    private String description;
    private String emoji_id;
    private String emoji_name;
}
