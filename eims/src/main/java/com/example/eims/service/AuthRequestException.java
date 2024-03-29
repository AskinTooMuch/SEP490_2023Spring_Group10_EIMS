/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 22/03/2023    1.0        ChucNV           First Deploy<br>
 */
package com.example.eims.service;

import org.springframework.http.HttpStatus;

import java.util.ArrayList;
import java.util.List;

public class AuthRequestException extends RuntimeException{
    public AuthRequestException(String message) {
        super(message);
    }

    public AuthRequestException(String message, Throwable cause) {
        super (message, cause);
    }
}
