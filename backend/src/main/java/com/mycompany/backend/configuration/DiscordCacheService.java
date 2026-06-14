package com.mycompany.backend.configuration;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class DiscordCacheService {
    private final Map<String, Object> discordItemCache = new ConcurrentHashMap<>();

    public Object getDiscordItem(String sessionId) {
        return discordItemCache.get(sessionId);
    }

    public void setDiscordItem(String key, Object data)
    {
        discordItemCache.put(key, data);
    }

    public void clearCache(String sessionId) {
        discordItemCache.remove(sessionId);
    }
}
