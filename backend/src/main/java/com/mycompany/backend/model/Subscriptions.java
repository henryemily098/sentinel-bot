package com.mycompany.backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Subscriptions {
    @Id
    @Column(name = "id", unique = true)
    private String id;

    @Column(name = "ownerId")
    private String ownerId;

    @Column(name = "startTimestamp")
    private long startTimestamp;

    @Column(name = "endTimestamp")
    private long endTimestamp;

    @Column(name = "joined")
    private boolean joined;
}