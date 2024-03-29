/*
 * Copyright (C) 2023, FPT University<br>
 * SEP490 - SEP490_G10<br>
 * EIMS<br>
 * Eggs Incubating Management System<br>
 *
 * Record of change:<br>
 * DATE         Version     Author      DESCRIPTION<br>
 * 27/03/2023   1.0         DuongNH     First Deploy<br>
 * 27/03/2023   2.0         DuongNH     Add function<br>
 */
package com.example.eims.dto.cost;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class CreateCostDTO {
    private Long userId;
    private Long facilityId;
    private String costItem;
    private BigDecimal costAmount;
    private BigDecimal paidAmount;
    private Date issueDate;
    private String note;
    private boolean status;
}
