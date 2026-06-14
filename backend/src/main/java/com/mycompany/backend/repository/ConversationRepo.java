package com.mycompany.backend.repository;

import com.mycompany.backend.model.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ConversationRepo extends JpaRepository<Conversation, String> {
    public Optional<Conversation> findConversationByGuildIdAndChannelId(String guildId, String channelId);
    public List<Conversation> findAllConversationByGuildId(String guildId);
}
