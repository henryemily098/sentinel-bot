package com.mycompany.backend.model.discord.guild;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IncidentsData {
    private Instant invites_disabled_until;
    private Instant dms_disabled_until;
    private Instant dm_spam_detected_at;
    private Instant raid_detected_at;
}
