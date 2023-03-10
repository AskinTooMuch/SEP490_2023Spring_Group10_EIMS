/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 16/02/2023    1.0        DuongVV          First Deploy<br>
 * 19/02/2023    2.0        DuongVV          Fix notation, id filed
 * 05/03/2023    3.0        ChucNV           Update attribute and naming
 */

package com.example.eims.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "breed")
public class Breed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long breedId;
    private Long specieId;
    private Long userId;
    private String breedName;
    private Float averageWeightMale;
    private Float averageWeightFemale;
    private String commonDisease;
    private int growthTime;
    private String imageSrc;
    private boolean status;
}
