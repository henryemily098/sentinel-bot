package com.mycompany.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuration")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Configuration {
    @Id
    @Column(name = "id", unique = true)
    private String id;

    @Column(name = "badwords_enabled")
    private boolean badwordsEnabled;

    @Column(name = "ai_sensitivity")
    private int AISentivity;

    @Column(name = "sexual_harassment_detected")
    private boolean sexualHarassmentDetected;

    @Column(name = "grooming_detected")
    private boolean groomingDetected;

    @Column(name = "scammer_detected")
    private boolean scammerDetected;

    @Column(name = "online_gamble_detected")
    private boolean onlineGambleDetected;

    @Column(name = "phising_link_detected")
    private boolean phisingLinkDetected;

    @Column(name = "log_channel_id")
    private String logChannelId;

    @Column(name = "prefix")
    private String prefix;

    @Transient
    private String nickname;
}