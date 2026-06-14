package com.mycompany.backend.model.discord;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Overwrite {
    private String id;
    private int type;
    private String allow;
    private String deny;
}
