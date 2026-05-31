package com.mycompany.backend.model.discord;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class Nameplate {
    private String sku_id;
    private String asset;
    private String label;
    private String palette;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Collectibles {
    private Nameplate nameplate;
}
