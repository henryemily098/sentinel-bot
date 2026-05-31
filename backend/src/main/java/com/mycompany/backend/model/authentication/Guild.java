package com.mycompany.backend.model.authentication;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Guild {
    private String id;
    private String name;
    private String icon;
    private String banner;
    private boolean owner;
    private String permissions;
    private String[] features;
    private int approximate_member_count;
    private int approximate_presence_count;

    public String getIconURL()
    {
        return "https://cdn.discordapp.com/icons/" + this.id + "/" + this.icon + ".png";
    }

    public String getBannerURL()
    {
        return "https://cdn.discordapp.com/banners/" + this.id + "/" + this.banner + ".png";
    }
}
