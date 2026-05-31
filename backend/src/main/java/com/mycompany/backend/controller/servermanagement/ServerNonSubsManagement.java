package com.mycompany.backend.controller.servermanagement;

import com.mycompany.backend.model.authentication.Guild;
import com.mycompany.backend.model.authentication.Token;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/server-management/non-subs")
public class ServerNonSubsManagement extends ServerManagement {
    @GetMapping("/{id}/subs")
    public String addSubsServerPage(@PathVariable("id") String serverId, HttpSession session, Model model)
    {
        Token token = (Token)session.getAttribute("token");
        if(token == null) return this.directAuth();

        Guild[] guilds = (Guild[])session.getAttribute("guilds");
        Guild guild = null;
        for(int i = 0; i < guilds.length && guild == null; i++)
        {
            if(guilds[i].getId().equals(serverId)) guild = guilds[i];
        }
        if(guild == null) return "redirect:" + this.getBaseURL() + "/server-management";

        long permissions = Long.parseLong(guild.getPermissions());
        if((permissions & 0x20L) != 0x20L && (permissions & 0x8L) != 0x8L && !guild.isOwner()) return "redirect:" + this.getBaseURL() + "/server-management";

        model.addAttribute("title", "Subscribe - Sentinel Bot");
        model.addAttribute("description", "Pilih satu server untuk berlangganan agar dapat menggunakan fitur kami!");
        return this.getBaseURL().equals("http://localhost:3000") ? "redirect:" + this.getBaseURL() + "/server-management/non-subs/" + guild.getId() + "/subs" : "index.html";
    }
}