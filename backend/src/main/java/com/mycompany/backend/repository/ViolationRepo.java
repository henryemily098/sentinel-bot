package com.mycompany.backend.repository;

import com.mycompany.backend.model.violation.Violation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface ViolationRepo extends JpaRepository<Violation, String> {
    public List<Violation> findAllByUserId(String userId);
    public List<Violation> findTop100ByGuildIdOrderByTimestamp(String guildId);
}
