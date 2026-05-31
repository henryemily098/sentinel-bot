package com.mycompany.backend.controller.serverdashboard;

import com.mycompany.backend.model.authentication.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@Controller
@RequestMapping("/dashboard/{id}")
public class ServerNonSubsDashboard extends BaseServerDashboard {
    @GetMapping("/history-logs")
    public String historyLogs(@PathVariable("id") String id, HttpSession session, Model model)
    {
        Token token = (Token)session.getAttribute("token");
        if(token == null) return this.directAuth();

        ArrayList<Guild> guilds = this.filteredGuilds((Guild[])session.getAttribute("guilds"));
        Guild guild = this.findGuild(guilds, id);

        return guild != null
                ? (this.getBaseURL().equals("http://localhost:3000") ? "redirect:" + this.getBaseURL() + "/dashboard/" + id + "/history-logs" : "index.html")
                : "redirect:" + (this.getBaseURL().equals("http://localhost:3000") ? this.getBaseURL() : "") + "/server-management";
    }
}
