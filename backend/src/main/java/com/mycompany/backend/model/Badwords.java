package com.mycompany.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "configuration")
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

    public void addWord(String word)
    {
        if(this.listBadwords == null) this.listBadwords = word;
        else this.listBadwords += " " + word;
    }

    public void addWords(String[] words)
    {
        String content = "";
        for(int i = 0; i < words.length; i++)
        {
            content += words[i];
            if(i + 1 < words.length) content += " ";
        }
        if(this.listBadwords == null) this.listBadwords = content;
        else this.listBadwords += " " + content;
    }

    @Transient
    public String[] getArrayListBadwords()
    {
        String[] emptyArray = {};
        return this.listBadwords != null ? this.listBadwords.split(" ") : emptyArray;
    }
}
