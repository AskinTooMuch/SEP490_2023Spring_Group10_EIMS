/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 04/03/2023    1.0        DuongVV          First Deploy<br>
 * 03/04/2023    1.1        DuongVV          Update function<br>
 */

package com.example.eims.controller;

import com.example.eims.service.interfaces.IRegistrationService;
import com.example.eims.service.interfaces.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/registration")
public class RegistrationController {
    @Autowired
    private IUserService userService;
    @Autowired
    private IRegistrationService registrationService;

    /**
     * View list registration of owners.
     *
     * @param status status of the registration
     * @return
     */
    @GetMapping("/all")
    //@Secured({"ROLE_MANAGER"})
    public ResponseEntity<?> viewListRegistration(@RequestParam int status) {
        return registrationService.viewListRegistration(status);
    }

    /**
     * View a registration of an owner.
     *
     * @param userId the id of the owner
     * @return
     */
    @GetMapping("/get")
    //@Secured({"ROLE_MANAGER"})
    public ResponseEntity<?> viewRegistration(@RequestParam Long userId) {
        return registrationService.viewRegistration(userId);
    }

    /**
     * Approve or Decline owner's registration.
     *
     * @param userId id of the user
     * @param approval is the decision of approval  (0 decline, 1 approve)
     * @return
     */
    @PostMapping("/approve")
    //@Secured({"ROLE_MANAGER"})
    public ResponseEntity<?> registrationApproval(@RequestParam Long userId, @RequestParam Long facilityId,
                                                  @RequestParam boolean approval) throws IOException {
        return registrationService.registrationApproval(userId, facilityId, approval);
    }
}
