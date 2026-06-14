package com.mycompany.backend.model.discord.guild;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class WelcomeScreen {
    private String description;
    private WelcomeScreenChannel[] welcome_channels;
}
