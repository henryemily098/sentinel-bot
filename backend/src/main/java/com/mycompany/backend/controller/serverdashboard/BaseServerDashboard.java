package com.mycompany.backend.controller.serverdashboard;

import com.mycompany.backend.model.authentication.Guild;
import com.mycompany.backend.repository.*;
import lombok.Getter;
import org.springframework.beans.factory.annotation.*;

import java.util.ArrayList;

@Getter
public abstract class BaseServerDashboard implements ServerDashboardInterface {
    @Autowired
    private SubscriptionsRepo subscriptionsRepo;

    @Value("${discordBot.token}")
    private String clientToken;

    @Value("${server.baseURL}")
    private String baseURL;

    @Override
    public String directAuth()
    {
        return "redirect:/auth/login";
    }

    @Override
    public String directAuth(String serverId)
    {
        return "redirect:/auth/login?server_id=" + serverId + "&guild=1";
    }

    public Guild findGuild(ArrayList<Guild> guilds, String serverId)
    {
        int idx = -1;
        for(int i = 0; i < guilds.size() && idx == -1; i++)
        {
            if(guilds.get(i).getId().equals(serverId)) idx = i;
        }
        return idx != -1 ? guilds.get(idx) : null;
    }

    public ArrayList<Guild> filteredGuilds(Guild[] guilds)
    {
        ArrayList<Guild> filtered = new ArrayList<>();
        for(int i = 0; i < guilds.length; i++)
        {
            long permissions = Long.parseLong(guilds[i].getPermissions());
            if((permissions & 0x20L) == 0x20L || (permissions & 0x8L) == 0x8L || guilds[i].isOwner()) filtered.add(guilds[i]);
        }
        return filtered;
    }
}
