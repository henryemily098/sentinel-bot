package com.mycompany.backend.model.violation;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@DiscriminatorValue("3")
public class Major extends Violation {
    @Transient
    @Column(name = "level")
    private final int level = 3;
    @Column(name = "color")
    private final String color = "red";
}
