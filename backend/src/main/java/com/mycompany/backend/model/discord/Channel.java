package com.mycompany.backend.model.discord;

import com.mycompany.backend.model.discord.guild.Member;
import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class DefaultReaction {
    private String emoji_id;
    private String emoji_name;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class Tag {
    private String id;
    private String name;
    private boolean moderated;
    private String emoji_id;
    private String emoji_name;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class ThreadMember {
    private String id;
    private String user_id;
    private Instant join_timestamp;
    private int flags;
    private Member member;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class ThreadMetadata {
    private boolean archived;
    private int auto_archive_duration;
    private Instant archive_timestamp;
    private boolean locked;
    private boolean invitable;
    private Instant create_timestamp;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class Overwrite {
    private String id;
    private int type;
    private String allow;
    private String deny;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Channel {
    private String id;
    private int type;
    private String guild_id;
    private int position;
    private Overwrite[] permission_overwrites;
    private String name;
    private String topic;
    private boolean nsfw;
    private String last_message_id;
    private int bitrate;
    private int user_limit;
    private int rate_limit_per_user;
    private User[] recipients;
    private String icon;
    private String owner_id;
    private String application_id;
    private boolean managed;
    private String parent_id;
    private Instant last_pin_timestamp;
    private String rtc_region;
    private int video_quality_mode;
    private int message_count;
    private int member_count;
    private ThreadMetadata thread_metadata;
    private ThreadMember member;
    private int default_auto_archive_duration;
    private String permissions;
    private int flags;
    private long total_message_sent;
    private Tag[] available_tags;
    private String[] applied_tags;
    private DefaultReaction default_reaction_emoji;
    private int default_thread_rate_limit_per_user;
    private int default_sort_order;
    private int default_forum_layout;
}