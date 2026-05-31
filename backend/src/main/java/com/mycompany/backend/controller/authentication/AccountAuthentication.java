package com.mycompany.backend.controller.authentication;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestMapping;

@Getter
@RequestMapping("/auth")
public abstract class AccountAuthentication implements AuthenticationInterface {
    @Value("${server.baseURL}")
    private String baseURL;
    
    @Value("${discordBot.clientId}")
    private String clientId;
    
    @Value("${discordBot.clientSecret}")
    private String clientSecret;
    
    @Value("${discordBot.callbackUrl}")
    private String callbackUrl;

    @Value("${discordBot.token}")
    private String token;
    
    @Override
    public String directDashboard()
    {
        return "redirect:" + this.baseURL + "/server-management";
    }
    @Override
    public String directDashboard(String serverId)
    {
        return "redirect:" + this.baseURL + "/dashboard/" + serverId;
    }

}
