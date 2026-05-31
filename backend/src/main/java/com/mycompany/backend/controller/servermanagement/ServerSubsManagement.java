package com.mycompany.backend.controller.servermanagement;

import com.mycompany.backend.model.authentication.Guild;
import com.mycompany.backend.model.authentication.Token;
import com.mycompany.backend.model.Subscriptions;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.Date;

@Controller
@RequestMapping("/server-management/subs")
public class ServerSubsManagement extends ServerManagement {
    @GetMapping("/{id}/add-bot")
    public String addBotToServerPage(@PathVariable("id") String serverId, HttpSession session)
    {
        Token token = (Token)session.getAttribute("token");
        if(token == null) return this.directAuth();

        Guild[] guilds = (Guild[])session.getAttribute("guilds");
        Guild[] clientGuilds = (Guild[])session.getAttribute("clientGuilds");

        Guild guild = null;
        for(int i = 0; i < guilds.length && guild == null; i++)
        {
            if(guilds[i].getId().equals(serverId)) guild = guilds[i];
        }
        if(guild == null) return "redirect:/server-management";

        long permissions = Long.parseLong(guild.getPermissions());
        if((permissions & 0x20L) != 0x20L && (permissions & 0x8L) != 0x8L && !guild.isOwner()) return "redirect:" + this.getBaseURL() + "/server-management";

        Subscriptions subsServer = this.getRepository().findSubscriptionsById(guild.getId()).orElse(null);
        if(subsServer == null) return "redirect:" + this.getBaseURL() + "/server-management/non-subs/" + guild.getId() + "/subs";

        long currentDate = new Date().getTime();
        if(currentDate > subsServer.getEndTimestamp())
        {
            this.getRepository().delete(subsServer);
            return "redirect:" + this.getBaseURL() + "/server-management/non-subs/" + guild.getId() + "/subs";
        }

        boolean isAvailable = false;
        for(int i = 0; i < clientGuilds.length && !isAvailable; i++)
        {
            isAvailable = clientGuilds[i].getId().equals(guild.getId());
        }

        if(isAvailable) return "redirect:" + this.getBaseURL() + "/dashboard/" + serverId;
        else return this.directAuth() + "?server_id=" + serverId + "&guild=1";
    }
}
