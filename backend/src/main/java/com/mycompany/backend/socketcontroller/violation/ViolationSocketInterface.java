package com.mycompany.backend.socketcontroller.violation;

import org.springframework.messaging.handler.annotation.DestinationVariable;

import java.util.List;
import java.util.Map;

public interface ViolationSocketInterface {
    public List<Map<String, Object>> handleViolationList(@DestinationVariable String sessionId, @DestinationVariable String guildId);
}
