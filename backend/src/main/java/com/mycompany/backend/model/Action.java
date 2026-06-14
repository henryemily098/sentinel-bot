package com.mycompany.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "action")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Action {
    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "guild_id", length = 500)
    private String guildId;

    @Column(name = "action") // KICK | BAN | TIMEOUT
    private String action;

    @Column(name = "duration") // ONLY FOR TIMEOUT AND BAN IN SECONDS
    private long duration;

    @Column(name = "requirement_count")
    private int requirementCount;
}
