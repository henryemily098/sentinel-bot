package com.mycompany.backend.socketcontroller;

import com.mycompany.backend.model.Badwords;
import com.mycompany.backend.repository.BadwordListRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.stereotype.Controller;

import java.util.Optional;

@Controller
public class BadwordSocket extends BaseSocket {
    @Autowired
    private BadwordListRepo repository;

    @MessageMapping("/{sessionId}/badword-list/{id}")
    @SendTo("/socket-response/{sessionId}/badword-list/{id}")
    public Badwords handleBadwordList(@DestinationVariable String sessionId, @DestinationVariable String id)
    {
        Optional<Badwords> badwordsListResponse = this.repository.findBadwordListById(id);
        Badwords badwordsList = null;
        if(badwordsListResponse.isPresent()) badwordsList = badwordsListResponse.get();
        else
        {
            badwordsList = new Badwords();
            badwordsList.setId(id);
        }
        return badwordsList;
    }

    @MessageMapping("/{sessionId}/badword-list/{id}/update")
    @SendTo("/socket-response/{sessionId}/badword-list/{id}/update")
    public Badwords handleBadwordListUpdate(@DestinationVariable String sessionId, @DestinationVariable String id, @Payload Badwords badwords)
    {
        this.repository.save(badwords);
        return badwords;
    }
}