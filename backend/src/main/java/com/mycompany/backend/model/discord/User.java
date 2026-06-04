package com.mycompany.backend.model.discord;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class UserPrimaryGuild {
    private String identify_guild_id;
    private boolean identify_enabled;
    private String tag;
    private String badge;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private String id;
    private String username;
    private String discriminator;
    private String global_name;
    private String avatar;
    private boolean bot;
    private boolean system;
    private boolean mfa_enabled;
    private String banner;
    private int accent_color;
    private String locale;
    private boolean verified;
    private String email;
    private long flags;
    private int premium_type;
    private long public_flags;
    private AvatarDecorationData avatar_decoration_data;
    private Collectibles collectibles;
    private UserPrimaryGuild primary_guild;
}
