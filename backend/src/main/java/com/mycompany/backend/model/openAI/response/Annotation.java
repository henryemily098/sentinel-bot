package com.mycompany.backend.model.openAI.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Annotation {
    private String file_id;
    private String filename;
    private int index;
    private String type;
}
