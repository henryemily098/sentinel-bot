package com.mycompany.backend.model.discord.guild;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Guild {
    private String id;
    private String name;
    private String icon;
    private String icon_hash;
    private String splash;
    private String discovery_splash;
    private boolean owner;
    private String owner_id;
    private String permissions;
    private String region;
    private String afk_channel_id;
    private int afk_timeout;
    private boolean widget_enabled;
    private String widget_channel_id;
    private int verification_level;
    private int default_message_notifications;
    private int explicit_content_filter;
    private Role[] roles;
    private Emoji[] emojis;
    private String[] features;
    private int mfa_level;
    private String application_id;
    private String system_channel_id;
    private int system_channel_flags;
    private String rules_channel_id;
    private long max_presences;
    private long max_members;
    private String vanity_url_code;
    private String description;
    private String banner;
    private int premium_tier;
    private int premium_subscription_count;
    private String preferred_locale;
    private String public_updates_channel_id;
    private int max_video_channel_users;
    private int max_stage_video_channel_users;
    private long approximate_member_count;
    private long approximate_presence_count;
    private WelcomeScreen welcome_screen;
    private int nsfw_level;
    private Sticker[] stickers;
    private boolean premium_progress_bar_enabled;
    private String safety_alerts_channel_id;
    private IncidentsData incidents_data;

    public String getIconURL()
    {
        return "https://cdn.discordapp.com/icons/" + this.id + "/" + this.icon + ".png";
    }
}
