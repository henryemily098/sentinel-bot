package com.mycompany.backend.controller.servermanagement;

import com.mycompany.backend.model.authentication.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/server-management")
public class ServerManagement extends BaseServerManagement {
    @GetMapping
    public String serverListPage(HttpSession session, Model model)
    {
        Token token = (Token)session.getAttribute("token");
        if(token == null) return this.directAuth();
        else
        {
            model.addAttribute("title", "Server Management - Sentinel Bot");
            model.addAttribute("description", "Manage your servers");
            return this.getBaseURL().equals("http://localhost:3000") ? "redirect:" + this.getBaseURL() + "/server-management" : "index.html";
        }
    }

    @GetMapping("/slots")
    public String addSubsSlotPage(HttpSession session, Model model)
    {
        Token token = (Token)session.getAttribute("token");
        if(token == null) return this.directAuth();
        {
            model.addAttribute("title", "Add Slot Subscription - Sentinel Bot");
            model.addAttribute("description", "Ganti slot kosong dengan server lain.");
            return this.getBaseURL().equals("http://localhost:3000") ? "redirect:" + this.getBaseURL() + "/server-management/slots" : "index.html";
        }
    }
}
