package com.mycompany.backend.repository;

import com.mycompany.backend.model.Action;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActionRepo extends JpaRepository<Action, String> {
    public List<Action> findAllActionsByGuildId(String guildId);
}
