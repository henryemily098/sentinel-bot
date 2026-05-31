package com.mycompany.backend.repository;

import com.mycompany.backend.model.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ConfigurationRepo extends JpaRepository<Configuration, String> {
    Optional<Configuration> findConfigurationById(String id);
}
