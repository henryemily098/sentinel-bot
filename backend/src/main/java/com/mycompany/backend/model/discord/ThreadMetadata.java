package com.mycompany.backend.model.discord;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThreadMetadata {
    private boolean archived;
    private int auto_archive_duration;
    private Instant archive_timestamp;
    private boolean locked;
    private boolean invitable;
    private Instant create_timestamp;
}
