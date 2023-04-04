/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 03/04/2023    1.0        DuongVV          First Deploy<br>
 */

package com.example.eims.dto.eggProduct;

import lombok.Data;

@Data
public class EggProductCreateExportDTO {
    private Long eggProductId;
    private int curAmount;
    private int exportAmount;
    private Float price;
    private Float vaccine;
}
