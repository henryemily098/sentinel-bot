package com.mycompany.backend.controller.authentication;

import org.springframework.web.bind.annotation.RequestMapping;

@RequestMapping("/auth")
public interface AuthenticationInterface {
    public String directDashboard();
    public String directDashboard(String serverId);
}