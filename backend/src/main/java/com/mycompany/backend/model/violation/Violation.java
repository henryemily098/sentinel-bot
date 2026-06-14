package com.mycompany.backend.model.violation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "violations")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "level", discriminatorType = DiscriminatorType.INTEGER)
@Getter
@Setter
public abstract class Violation {
    @Id
    @Column(name = "id", unique = true, length = 500)
    private String id;

    @Column(name = "guildId", length = 500)
    private String guildId;

    @Column(name = "channelId", length = 500)
    private String channelId;

    @Column(name = "userId", length = 500)
    private String userId;

    @Column(name = "messageId", length = 500)
    private String messageId;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "timestamp")
    private long timestamp;
}