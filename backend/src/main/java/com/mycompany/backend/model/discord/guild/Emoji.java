package com.mycompany.backend.model.discord.guild;

import com.mycompany.backend.model.discord.User;
import lombok.*;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Emoji {
    private String id;
    private String name;
    private Role[] roles;
    private User user;
    private boolean require_colons;
    private boolean managed;
    private boolean animated;
    private boolean available;
}
