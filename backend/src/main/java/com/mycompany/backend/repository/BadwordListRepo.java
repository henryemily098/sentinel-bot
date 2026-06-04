package com.mycompany.backend.repository;

import com.mycompany.backend.model.Badwords;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BadwordListRepo extends JpaRepository<Badwords, String> {
    public Optional<Badwords> findBadwordListById(String id);
}
