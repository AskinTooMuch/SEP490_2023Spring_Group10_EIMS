/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 06/03/2023    1.0        ChucNV           First Deploy<br>
 * 28/03/2023    1.1        ChucNV           Remove phase dates<br>
 */
package com.example.eims.dto.specie;

import lombok.Data;

@Data
public class DetailSpecieDTO {
    private Long specieId;
    private String specieName;
    private int incubationPeriod;
    private boolean status;
}
