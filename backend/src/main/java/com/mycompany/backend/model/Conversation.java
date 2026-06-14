package com.mycompany.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "conversation")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Conversation {
    @Id
    @Column(name = "id", unique = true)
    private String id;

    @Column(name = "channelId", unique = true)
    private String channelId;

    @Column(name = "guildId")
    private String guildId;

    @Column(name = "limit_message")
    private int limitMessage;

    @Column(name = "count")
    private int count;
}
