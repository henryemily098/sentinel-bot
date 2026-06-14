package com.mycompany.backend.socketcontroller;

import com.mycompany.backend.model.Action;
import com.mycompany.backend.repository.ActionRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
public class ActionSocket extends BaseSocket {
    @Autowired
    private ActionRepo repository;

    @MessageMapping("/{sessionId}/actions/{id}")
    @SendTo("/socket-response/{sessionId}/actions/{id}")
    public List<Action> handleActionFetch(@DestinationVariable String sessionId, @DestinationVariable String id)
    {
        return this.repository.findAllActionsByGuildId(id);
    }

    @MessageMapping("/{sessionId}/actions/{id}/update")
    @SendTo("/socket-response/{sessionId}/actions/{id}/update")
    public List<Action> handleActionAdd(@DestinationVariable String sessionId, @DestinationVariable String id, @Payload List<Action> actions)
    {
        return this.repository.saveAll(actions);
    }
}
