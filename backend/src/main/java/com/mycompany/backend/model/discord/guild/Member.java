package com.mycompany.backend.model.discord.guild;

import com.mycompany.backend.model.discord.*;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Member {
    private User user;
    private String nick;
    private String avatar;
    private String banner;
    private String[] roles;
    private Instant joined_at;
    private Instant premium_since;
    private boolean deaf;
    private boolean mute;
    private int flags;
    private boolean pending;
    private String permissions;
    private Instant communication_disabled_until;
    private AvatarDecorationData avatar_decoration_data;
    private Collectibles collectibles;
}
