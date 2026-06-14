package com.mycompany.backend.model.discord.guild;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GuildMemberUpdate {
    private String nick;
    private String banner;
    private String avatar;
    private String bio;
}
