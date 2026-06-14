package com.mycompany.backend.model.discord;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserPrimaryGuild {
    private String identify_guild_id;
    private boolean identify_enabled;
    private String tag;
    private String badge;
}
