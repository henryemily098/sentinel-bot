package com.mycompany.backend.controller.servermanagement;

import com.mycompany.backend.repository.SubscriptionsRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

public abstract class BaseServerManagement implements ServerManagementInterface {
    @Autowired
    private SubscriptionsRepo repository;

    @Value("${server.baseURL}")
    private String baseURL;

    @Override
    public String directAuth()
    {
        return "redirect:/auth/login";
    }

    public String getBaseURL()
    {
        return this.baseURL;
    }

    public SubscriptionsRepo getRepository()
    {
        return this.repository;
    }
}
