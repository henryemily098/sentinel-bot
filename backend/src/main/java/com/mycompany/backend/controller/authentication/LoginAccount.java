package com.mycompany.backend.controller.authentication;
import com.mycompany.backend.model.Configuration;
import com.mycompany.backend.model.authentication.Guild;
import com.mycompany.backend.model.authentication.Token;
import com.mycompany.backend.model.discord.User;
import com.mycompany.backend.repository.ConfigurationRepo;
import jakarta.servlet.http.HttpSession;
import java.net.URLEncoder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestClient;

@Controller
public class LoginAccount extends AccountAuthentication {
    @Autowired
    private ConfigurationRepo repository;

    @GetMapping("/login")
    public String authentication(@RequestParam(value="server_id", required=false) String serverId, @RequestParam(value="guild", required=false) String guild, HttpSession session)
    {
        User user = (User)session.getAttribute("user");
        if(user != null && guild == null) return this.directDashboard();
        try {
            String url = "https://discord.com/oauth2/authorize";
            url += "?client_id=" + this.getClientId();
            url += "&response_type=code";
            url += "&redirect_uri=" + URLEncoder.encode(this.getCallbackUrl(), "utf-8");
            if(guild != null)
            {
                url += "&scope=identify+guilds+email+bot";
                url += "&integration_type=0";
                url += "&permissions=8";
                if(serverId != null) url += "&guild_id=" + serverId;
            }
            else url += "&scope=identify+guilds+email";
            return "redirect:" + url;
        } catch (Exception e) {
            return "redirect:" + this.getBaseURL();
        }
    }
    
    @GetMapping("/login/callback")
    public String callback(@RequestParam(value="code", required=false) String code, @RequestParam(value="guild_id", required=false) String serverId, HttpSession session)
    {
        User user = (User)session.getAttribute("user");
        if(user != null) return this.directDashboard();
        
        if(code == null) return "redirect:" + this.getBaseURL();
        try {
            RestClient restClient = RestClient.create();
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("redirect_uri", this.getCallbackUrl());
            formData.add("grant_type", "authorization_code");
            formData.add("code", code);

            Token token = restClient.post()
                    .uri("https://discord.com/api/v10/oauth2/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .headers(h -> h.setBasicAuth(this.getClientId(), this.getClientSecret()))
                    .body(formData)
                    .retrieve()
                    .body(Token.class);
            user = restClient.get()
                    .uri("https://discord.com/api/v10/users/@me")
                    .header("Authorization", token.getToken_type() + " " + token.getAccess_token())
                    .retrieve()
                    .body(User.class);
            Guild[] guilds = restClient.get()
                    .uri("https://discord.com/api/v10/users/@me/guilds?with_counts=true")
                    .header("Authorization", token.getToken_type() + " " + token.getAccess_token())
                    .retrieve()
                    .body(Guild[].class);
            Guild[] clientGuilds = restClient.get()
                    .uri("https://discord.com/api/v10/users/@me/guilds?with_counts=true")
                    .header("Authorization", "Bot " + this.getToken())
                    .retrieve()
                    .body(Guild[].class);
            session.setAttribute("token", token);
            session.setAttribute("user", user);
            session.setAttribute("guilds", guilds);
            session.setAttribute("clientGuilds", clientGuilds);
            
            if(serverId != null)
            {
                Configuration configuration = this.repository.findConfigurationById(serverId).orElse(null);
                if(configuration == null)
                {
                    configuration = new Configuration();
                    configuration.setId(serverId);
                    configuration.setBadwordsEnabled(true);
                    configuration.setScammerDetected(true);
                    configuration.setPhisingLinkDetected(true);
                    configuration.setLogChannelId(null);
                    configuration.setPrefix("!");
                    this.repository.save(configuration);
                }
                return this.directDashboard(serverId);
            }
            return this.directDashboard();
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:" + this.getBaseURL();
        }
    }

    @GetMapping("/login/refresh")
    public String refresh(HttpSession session)
    {
        RestClient rs = RestClient.create();
        Token token = (Token)session.getAttribute("token");
        if(token == null) return "redirect:/auth/login";

        try {
            User user = rs.get()
                    .uri("https://discord.com/api/v10/users/@me")
                    .header("Authorization", token.getToken_type() + " " + token.getAccess_token())
                    .retrieve()
                    .body(User.class);
            Guild[] guilds = rs.get()
                    .uri("https://discord.com/api/v10/users/@me/guilds?with_counts=true")
                    .header("Authorization", token.getToken_type() + " " + token.getAccess_token())
                    .retrieve()
                    .body(Guild[].class);
            Guild[] clientGuilds = rs.get()
                    .uri("https://discord.com/api/v10/users/@me/guilds?with_counts=true")
                    .header("Authorization", "Bot " + this.getToken())
                    .retrieve()
                    .body(Guild[].class);
            session.setAttribute("user", user);
            session.setAttribute("guilds", guilds);
            session.setAttribute("clientGuilds", clientGuilds);
            
            return this.directDashboard();
        } catch (Exception e) {
            e.printStackTrace();
            return "redirect:" + this.getBaseURL();
        }
    }
    
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:" + this.getBaseURL();
    }
}