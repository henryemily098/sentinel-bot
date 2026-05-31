package com.mycompany.backend.controller.serverdashboard;

import com.mycompany.backend.model.*;
import com.mycompany.backend.model.authentication.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
@RequestMapping("/dashboard")
public class ServerDashboard extends BaseServerDashboard {
    @GetMapping
    public String directServerManagement()
    {
        return "redirect:" + (this.getBaseURL().equals("http://localhost:3000") ? this.getBaseURL()  : "") + "/server-management";
    }

    @GetMapping("/{id}")
    public String mainPage(@PathVariable("id") String id, HttpSession session, Model model)
    {
        Token token = (Token)session.getAttribute("token");
        if(token == null) return this.directAuth();

        ArrayList<Guild> guilds = filteredGuilds((Guild[])session.getAttribute("guilds"));
        Guild guild = findGuild(guilds, id);

        return guild != null
                ? (this.getBaseURL().equals("http://localhost:3000") ? "redirect:" + this.getBaseURL() + "/dashboard/" + id : "index.html")
                : "redirect:" + (this.getBaseURL().equals("http://localhost:3000") ? this.getBaseURL() : "") + "/server-management";
    }
}
