package com.mycompany.backend.socketcontroller;

import org.springframework.messaging.simp.SimpMessagingTemplate;

public interface SocketInterface {
    public SimpMessagingTemplate getMessageTemplate();
}