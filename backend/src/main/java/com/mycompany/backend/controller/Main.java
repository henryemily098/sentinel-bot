package com.mycompany.backend.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping
public class Main {
    @Value("${server.baseURL}")
    private String baseURL;

    @GetMapping
    public String landing(Model model) {
        model.addAttribute("title", "Sentinel Bot");
        model.addAttribute("description", "Selamat datang di basecamp Sentinel Bot! Sebuah tempat di mana anda bisa mengatur Sentinel Bot untuk keamanan server anda.");
        return this.baseURL.equals("http://localhost:3000") ? "redirect:" + this.baseURL : "index.html";
    }
}
