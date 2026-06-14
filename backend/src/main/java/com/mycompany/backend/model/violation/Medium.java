package com.mycompany.backend.model.violation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@DiscriminatorValue("2")
public class Medium extends Violation {
    @Transient
    @Column(name = "level")
    private final int level = 2;
    @Column(name = "color")
    private final String color = "orange";
}
