package com.mycompany.backend.model.discord;

import com.mycompany.backend.model.discord.guild.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThreadMember {
    private String id;
    private String user_id;
    private Instant join_timestamp;
    private int flags;
    private Member member;
}
