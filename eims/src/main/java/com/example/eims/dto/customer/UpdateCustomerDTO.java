/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 19/02/2023    1.0        DuongVV          First Deploy<br>
 */

package com.example.eims.dto.customer;
import lombok.Data;

@Data
public class UpdateCustomerDTO {
    private Long userId;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerAddress;
    private String customerMail;
    private int status;
}
