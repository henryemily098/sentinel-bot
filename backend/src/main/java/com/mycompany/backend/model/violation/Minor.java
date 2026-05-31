package com.mycompany.backend.model.violation;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Getter
@DiscriminatorValue("1")
public class Minor extends Violation {
    @Transient
    @Column(name = "level")
    private final int level = 1;

    private final String color = "yellow";

    public Minor(String userId, String guildId, String reason)
    {
        super(userId, guildId, reason);
    }

    public void doMoreAction(int action, Optional<Integer> duration)
    {
        switch (action)
        {
            case 1:
                this.timeoutMember(duration.orElse(0));
                break;
            case 2:
                this.kickMember();
                break;
            case 3:
                this.banMember();
                break;
        }
        this.setAction(action);
    }
}