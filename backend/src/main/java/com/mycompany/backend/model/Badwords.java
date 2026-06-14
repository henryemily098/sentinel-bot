package com.mycompany.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "badwords")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Badwords {
    @Id
    @Column(name = "id", unique = true)
    private String id;

    @Column(name = "list_badwords", columnDefinition = "LONGTEXT")
    private String listBadwords;

    @Transient
    public boolean isBadwordsInMessage(String content)
    {
        if(this.listBadwords == null || listBadwords.isBlank()) return false;

        String[] words = this.listBadwords.split(" ");
        for (String word : words) {
            if (content.contains(word)) return true;
        }
        return false;
    }
}
