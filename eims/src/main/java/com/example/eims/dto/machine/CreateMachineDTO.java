/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 18/02/2023    1.0        DuongVV          First Deploy<br>
 */

package com.example.eims.dto.machine;

import lombok.Data;

@Data
public class CreateMachineDTO {
    private Long machineTypeId;
    private Long facilityId;
    private String machineName;
    private int maxCapacity;
}
