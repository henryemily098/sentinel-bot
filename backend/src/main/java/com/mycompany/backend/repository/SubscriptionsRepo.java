package com.mycompany.backend.repository;

import com.mycompany.backend.model.Subscriptions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface SubscriptionsRepo extends JpaRepository<Subscriptions, String> {
    public Optional<Subscriptions> findSubscriptionsById(String id);
    public List<Subscriptions> findAllSubscriptionsByOwnerId(String ownerId);
}