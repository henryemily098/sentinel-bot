package com.mycompany.backend.controller.authentication;

import com.mycompany.backend.model.authentication.Guild;
import com.mycompany.backend.model.authentication.Token;
import com.mycompany.backend.model.discord.*;
import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

@Getter
class ErrorResponse {
    private final String message;
    private final HttpStatus status;
    
    public ErrorResponse(String message, HttpStatus status)
    {
        this.message = message;
        this.status = status;
    }
}

@RestController
public class ManageAccount extends AccountAuthentication {
    @GetMapping("/account/current-token")
    public ResponseEntity<?> currentToken(HttpSession session)
    {
        Token token = (Token)session.getAttribute("token");
        ErrorResponse errorResponse = new ErrorResponse("You're not authorize yet!", HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(token == null ? errorResponse.getStatus() : HttpStatus.OK).body(token == null ? errorResponse : token);
    }
    
    @GetMapping("/account/current-user")
    public ResponseEntity<?> currentUser(HttpSession session)
    {
        User user = (User)session.getAttribute("user");
        ErrorResponse errorResponse = new ErrorResponse("You're not authorize yet!", HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(user == null ? errorResponse.getStatus() : HttpStatus.OK).body(user == null ? errorResponse : user);
    }
    
    @GetMapping("/account/current-guilds")
    public ResponseEntity<?> currentGuilds(HttpSession session)
    {
        Guild[] guilds = (Guild[])session.getAttribute("guilds");
        ErrorResponse errorResponse = new ErrorResponse("You're not authorize yet!", HttpStatus.UNAUTHORIZED);
        return ResponseEntity.status(guilds == null ? errorResponse.getStatus() : HttpStatus.OK).body(guilds == null ? errorResponse : guilds);
    }
    
    @PatchMapping("/account/refresh-token")
    public ResponseEntity<?> refreshToken(HttpSession session)
    {
        RestClient restClient = RestClient.create();
        Token token = (Token)session.getAttribute("token");
        ErrorResponse errorResponse = new ErrorResponse("You're not authorize yet!", HttpStatus.UNAUTHORIZED);
        if(token == null) return ResponseEntity.status(errorResponse.getStatus()).body(errorResponse);
        
        try {
            MultiValueMap<String, String> formData = new LinkedMultiValueMap<>();
            formData.add("grant_type", "refresh_token");
            formData.add("refresh_token", token.getRefresh_token());

            Token newToken = restClient.post()
                    .uri("https://discord.com/api/v10/oauth2/token")
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .headers(h -> h.setBasicAuth(this.getClientId(), this.getClientSecret()))
                    .body(formData)
                    .retrieve()
                    .body(Token.class);
            User user = restClient.get()
                    .uri("https://discord.com/api/v10/users/@me")
                    .header("Authorization", newToken.getToken_type() + " " + newToken.getAccess_token())
                    .retrieve()
                    .body(User.class);
            session.setAttribute("token", newToken);
            session.setAttribute("user", user);
            
            return ResponseEntity.status(HttpStatus.OK).body(newToken);
        } catch (Exception e) {
            e.printStackTrace();
            errorResponse = new ErrorResponse("Something wrong when we try to refresh your token!", HttpStatus.INTERNAL_SERVER_ERROR);
            return ResponseEntity.status(errorResponse.getStatus()).body(errorResponse);
        }
    }
}