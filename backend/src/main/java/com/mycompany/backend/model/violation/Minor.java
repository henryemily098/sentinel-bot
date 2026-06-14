package com.mycompany.backend.model.violation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@DiscriminatorValue("1")
public class Minor extends Violation {
    @Transient
    @Column(name = "level")
    private final int level = 1;
    @Column(name = "color")
    private final String color = "yellow";
}