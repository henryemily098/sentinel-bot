package com.mycompany.backend.model.violation;

import jakarta.persistence.*;
import lombok.*;
import java.util.*;

@Entity
@Getter
@DiscriminatorValue("3")
public class Major extends Violation {
    @Transient
    @Column(name = "level")
    private final int level = 3;

    private final String color = "red";

    public Major(String userId, String guildId, String reason)
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
