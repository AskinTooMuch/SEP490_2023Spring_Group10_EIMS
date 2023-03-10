/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE         Version     Author      DESCRIPTION<br>
 * 02/03/2023   1.0         ChucNV      First Deploy<br>
 * 02/03/2023   2.0         ChucNV      Implement signup service
 */
package com.example.eims.service.impl;

import com.example.eims.dto.auth.*;
import com.example.eims.entity.*;
import com.example.eims.repository.*;
import com.example.eims.service.interfaces.IAuthService;
import com.example.eims.utils.StringDealer;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class AuthServiceImpl implements IAuthService {
    @Autowired
    private final AuthenticationManager authenticationManager;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final FacilityRepository facilityRepository;
    @Autowired
    private final WorkInRepository workInRepository;
    @Autowired
    private final RegistrationRepository registrationRepository;
    @Autowired
    private final OtpRepository otpRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    private final StringDealer stringDealer;

    public AuthServiceImpl(AuthenticationManager authenticationManager, UserRepository userRepository,
                           FacilityRepository facilityRepository, WorkInRepository workInRepository,
                           RegistrationRepository registrationRepository, OtpRepository otpRepository,
                           PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.facilityRepository = facilityRepository;
        this.workInRepository = workInRepository;
        this.registrationRepository = registrationRepository;
        this.otpRepository = otpRepository;
        this.passwordEncoder = passwordEncoder;
        this.stringDealer = new StringDealer();
    }

    /**
     * Sign in.
     *
     * @param loginDTO contains the login phone and password
     * @return
     */
    @Override
    public ResponseEntity<?> authenticateUser(LoginDTO loginDTO) {
        String phone = stringDealer.trimMax(loginDTO.getPhone());
        if (phone.equals("")) { /* Phone number is empty */
            return new ResponseEntity<>("S??? ??i???n tho???i kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        String password = stringDealer.trimMax(loginDTO.getPassword());
        if (password.equals("")) { /* Password is empty */
            return new ResponseEntity<>("M???t kh???u kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        User user = userRepository.findByPhone(loginDTO.getPhone()).get();
        // Check status of Account
        if (user.getStatus() == 0) {
            return new ResponseEntity<>("T??i kho???n ???? b??? v?? hi???u h??a", HttpStatus.BAD_REQUEST);
        }
        /*        if (user.getRoleId() == 2L) { *//*role is OWNER (have Facility)*//*
            // Check status of registration
            // 0 - considering
            // 1 - rejected
            // 2 - approved
            Registration registration = registrationRepository.findByUserId(user.getUserId()).get();
            if (registration.getStatus() == 0L) { *//* status = 0 (considering) *//*
                return new ResponseEntity<>("????n ????ng k?? ch??a ???????c ch???p thu???n", HttpStatus.BAD_REQUEST);
            }
            if (registration.getStatus() == 1L) { *//* status = 1 (rejected) *//*
                return new ResponseEntity<>("????n ????ng k?? b??? t??? ch???i ", HttpStatus.BAD_REQUEST);
            }
        }
        if (user.getRoleId() == 3L) { *//*role is EMPLOYEE (work in Facility)*//*
            WorkIn workIn = workInRepository.findByUserId(user.getUserId()).get();
            Long facilityId = workIn.getFacilityId();
            if (facilityRepository.getStatusById(facilityId) == 0) { *//* status = 0 (facility stopped running) *//*
                return new ResponseEntity<>("C?? s??? ???? d???ng ho???t ?????ng", HttpStatus.BAD_REQUEST);
            }
        }*/

        Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(phone, password));
        SecurityContextHolder.getContext().setAuthentication(auth);
        // System.out.println(SecurityContextHolder.getContext().getAuthentication().getAuthorities());
        // Set attribute to sessionDTO
        SessionDTO sessionDTO = new SessionDTO();
        sessionDTO.setUserId(user.getUserId());
        Long userRole = user.getRoleId();
        sessionDTO.setRoleId(userRole);
        if (userRole == 2L) { /*role is OWNER (have Facility)*/
            Facility facility = facilityRepository.findByUserId(user.getUserId()).get();
            sessionDTO.setFacilityId(facility.getFacilityId());
            return new ResponseEntity<>(sessionDTO, HttpStatus.OK);
        } else if (userRole == 3L) { /*role is EMPLOYEE (work in Facility)*/
            WorkIn workIn = workInRepository.findByUserId(user.getUserId()).get();
            sessionDTO.setFacilityId(workIn.getFacilityId());
            return new ResponseEntity<>(sessionDTO, HttpStatus.OK);
        } else { /*role USER, MODERATOR, ADMIN (no Facility)*/
            sessionDTO.setFacilityId(null);
            return new ResponseEntity<>(sessionDTO, HttpStatus.OK);
        }
    }

    /**
     * Sign up.
     *
     * @param signUpDTO contains the User's name, email, phone number, date of birth, address.
     * @return
     */
    @Override
    @Transactional
    public ResponseEntity<?> registerUser(SignUpDTO signUpDTO) {
        // If not existed: Create new user, add into database and return.
        User user = new User();
        // Check input
        // Username
        String username = stringDealer.trimMax(signUpDTO.getUsername());
        if (username.equals("")) { /* Username is empty */
            return new ResponseEntity<>("T??n kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        // Date of birth
        String sDate = stringDealer.trimMax(signUpDTO.getUserDob());
        if (sDate.equals("")) { /* Date of birth is empty */
            return new ResponseEntity<>("Ng??y sinh kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        // Phone number
        String phone = stringDealer.trimMax(signUpDTO.getUserPhone());
        if (phone.equals("")) { /* Phone number is empty */
            return new ResponseEntity<>("S??? ??i???n tho???i kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPhoneRegex(phone)) { /* Phone number is not valid*/
            return new ResponseEntity<>("S??? ??i???n tho???i kh??ng ????ng ??inh d???ng", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByPhone(phone)) {/* Phone number is existed*/
            return new ResponseEntity<>("S??? ??i???n tho???i ???? ???????c s??? d???ng", HttpStatus.BAD_REQUEST);
        }
        // Email
        String email = stringDealer.trimMax(signUpDTO.getUserEmail());
        if ((!email.equals("")) && !stringDealer.checkEmailRegex(email)) { /* Email is not valid */
            return new ResponseEntity<>("Email kh??ng ????ng ?????nh d???ng", HttpStatus.BAD_REQUEST);
        }
        // Address
        String address = stringDealer.trimMax(signUpDTO.getUserAddress());
        if (address.equals("")) { /* Address is empty */
            return new ResponseEntity<>("?????a ch??? kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        // Password
        String password = stringDealer.trimMax(signUpDTO.getUserPassword());
        if (password.equals("")) { /* Password is empty */
            return new ResponseEntity<>("M???t kh???u kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPasswordRegex(password)) { /* Password is not valid */
            return new ResponseEntity<>("M???t kh???u kh??ng ????ng ?????nh d???ng", HttpStatus.BAD_REQUEST);
        }
        // Confirm password
        String rePassword = stringDealer.trimMax(signUpDTO.getUserPassword());
        if (rePassword.equals("")) { /* Confirm password is empty */
            return new ResponseEntity<>("M???t kh???u kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        // Password match
        if (!password.equals(rePassword)) { /* Password not match */
            return new ResponseEntity<>("M???t kh???u kh??ng kh???p", HttpStatus.BAD_REQUEST);
        }
        // Set attribute
        user.setUsername(username);
        user.setEmail(email);
        Date date = stringDealer.convertToDateAndFormat(sDate);
        user.setDob(date);
        user.setPhone(phone);
        user.setAddress(address);
        user.setRoleId(2L);     /* Role OWNER */
        user.setStatus(0);      /* Inactivated, need registration's approval */
        //Encode password
        user.setPassword(passwordEncoder.encode(password));
        try {
            User returnUser = userRepository.save(user);
            // Facility
            Facility facility = new Facility();
            facility.setUserId(returnUser.getUserId());
            // Name
            String fName = stringDealer.trimMax(signUpDTO.getFacilityName());
            if (fName.equals("")) { /* Facility name is empty */
                return new ResponseEntity<>("T??n c?? s??? kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
            }
            facility.setFacilityName(fName);
            // Found date
            sDate = stringDealer.trimMax(signUpDTO.getFacilityFoundDate());
            if (sDate.equals("")) {  /* Found date is empty */
                return new ResponseEntity<>("Ng??y th??nh l???p kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
            }
            date = stringDealer.convertToDateAndFormat(sDate);
            facility.setFacilityFoundDate(date);
            // Hotline (Using the same format with cellphone number)
            String hotline = stringDealer.trimMax(signUpDTO.getFacilityHotline());
            if (hotline.equals("")) { /* Hotline is empty */
                return new ResponseEntity<>("Hotline kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
            }
            if (!stringDealer.checkPhoneRegex(hotline)) { /* Hotline is not valid */
                return new ResponseEntity<>("Hotline kh??ng ????ng ?????nh d???ng", HttpStatus.BAD_REQUEST);
            }
            facility.setHotline(hotline);
            // Address
            String fAddress = stringDealer.trimMax(signUpDTO.getFacilityAddress());
            if (fAddress.equals("")) { /* Address is empty */
                return new ResponseEntity<>("?????a ch??? c?? s??? kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
            }
            facility.setFacilityAddress(fAddress);
            // Business license number
            String licenseNumber = stringDealer.trimMax(signUpDTO.getBusinessLicenseNumber());
            if (licenseNumber.equals("")) { /* Business license number is empty */
                return new ResponseEntity<>("S??? ????ng k?? kinh doanh kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
            }
            facility.setBusinessLicenseNumber(licenseNumber);

            facility.setStatus(0);  /* Inactivated, need registration's approval */
            facilityRepository.save(facility);

            // Registration
            Registration registration = new Registration();
            registration.setUserId(returnUser.getUserId());
            registration.setRegisterDate(Date.valueOf(LocalDate.now()));
            registration.setStatus(0);
            registrationRepository.save(registration);
            return new ResponseEntity<>("????ng k?? th??nh c??ng, vui l??ng ?????i x??c nh???n t??i kho???n", HttpStatus.OK);
        } catch (IllegalArgumentException iae) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Change password.
     *
     * @param changePasswordDTO contains the login phone, old password and new password
     * @return
     */
    @Override
    public ResponseEntity<?> changePassword(ChangePasswordDTO changePasswordDTO) {
        // Check blank input
        String password = stringDealer.trimMax(changePasswordDTO.getPassword());
        if (password.equals("")) { /* Password is empty */
            return new ResponseEntity<>("M???t kh???u kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        String newPassword = stringDealer.trimMax(changePasswordDTO.getNewPassword());
        if (newPassword.equals("")) { /* New password is empty */
            return new ResponseEntity<>("M???t kh???u m???i kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPasswordRegex(newPassword)) { /* New password is not valid */
            return new ResponseEntity<>("M???t kh???u m???i kh??ng ????ng ?????nh d???ng", HttpStatus.BAD_REQUEST);
        }
        //Local variable for the user
        Optional<User> userOpt;
        //Check credentials, if not valid then return Bad request (403)
        userOpt = userRepository.findByUserId(changePasswordDTO.getUserId());
        if (userOpt.isEmpty() ||
                !passwordEncoder.matches(password, userOpt.get().getPassword())) { /* Old password not match*/
            return new ResponseEntity<>("M???t kh???u c?? sai", HttpStatus.BAD_REQUEST);
        } else { /* Old password is correct */
            //Encode the passwords
            newPassword = passwordEncoder.encode(newPassword);
            User user = userOpt.get();
            user.setPassword(newPassword);
            userRepository.save(user);
            return new ResponseEntity<>("Thay ?????i m???t kh???u th??nh c??ng", HttpStatus.OK);
        }
    }

    /**
     * Send OTP to reset password.
     *
     * @param phone the phone number of the account
     * @return
     */
    @Override
    public ResponseEntity<?> sendOTPResetPass(String phone) {
        // Check credentials, if not valid then return Bad request (403)
        Optional<User> userOptional = userRepository.findByPhone(phone);
        if (!userOptional.isPresent()) { /* No user found */
            return new ResponseEntity<>("Kh??ng t??m th???y s??? ??i???n tho???i", HttpStatus.BAD_REQUEST);
        } else {
            // Create OTP
            String OTP = "111";
            Otp otp = new Otp();
            otp.setPhoneNumber(phone);
            otp.setOtp(OTP);
            otpRepository.save(otp);

            // Send OTP

            //
            return new ResponseEntity<>("???? g???i m?? OTP", HttpStatus.OK);
        }
    }

    /**
     * Verify OTP forgot password.
     *
     * @param verifyOtpDTO
     * @return
     */
    @Override
    public ResponseEntity<?> verifyOTPResetPass(VerifyOtpDTO verifyOtpDTO) {
        // Check if the OTP match
        String phone = verifyOtpDTO.getPhone();
        String otpSend = verifyOtpDTO.getOTP();
        Otp otpReal = otpRepository.findByPhoneNumber(phone).get();
        if (otpSend.equals(otpReal.getOtp())) {      /* OTP match*/
            // Reset otp
            otpRepository.delete(otpReal);
            return new ResponseEntity<>("M?? OTP ???? ????ng", HttpStatus.OK);
        } else {                        /* OTP not match*/

            return new ResponseEntity<>("M?? OTP sai", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Re-send OTP forgot password.
     *
     * @return
     */
    @Override
    public ResponseEntity<?> resendOTPResetPass(String phone) {
        // Check credentials, if not valid then return Bad request (403)
        Optional<Otp> otpOptional = otpRepository.findByPhoneNumber(phone);
        if (!otpOptional.isPresent()) {
            // Create OTP
            String OTP = "111";
            Otp otp = new Otp();
            otp.setPhoneNumber(phone);
            otp.setOtp(OTP);
            otpRepository.save(otp);
            // Send OTP

            //

        } else {
            // Create OTP
            // Create OTP
            String OTP = "111";
            Otp otp = otpRepository.findByPhoneNumber(phone).get();
            otp.setPhoneNumber(phone);
            otp.setOtp(OTP);
            otpRepository.save(otp);
            // Send OTP

            //
        }
        return new ResponseEntity<>("???? g???i l???i m?? OTP", HttpStatus.OK);

    }


    /**
     * Change password after verify OTP.
     *
     * @param forgotPasswordDTO contains the new password, login phone
     * @return
     */
    @Override
    public ResponseEntity<?> resetPassword(ForgotPasswordDTO forgotPasswordDTO) {
        String phone = stringDealer.trimMax(forgotPasswordDTO.getPhone());
        String newPassword = stringDealer.trimMax(forgotPasswordDTO.getNewPassword());
        String confirmPassword = stringDealer.trimMax(forgotPasswordDTO.getNewPassword());
        if (newPassword.equals("")) { /* Password is empty */
            return new ResponseEntity<>("M???t kh???u kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        if (confirmPassword.equals("")) { /* Confirm Password is empty */
            return new ResponseEntity<>("X??c nh???n m???t kh???u kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPasswordRegex(newPassword)) { /* Password is not valid */
            return new ResponseEntity<>("M???t kh???u kh??ng ????ng ?????nh d???ng", HttpStatus.BAD_REQUEST);
        }

        // Get user
        User user = userRepository.findByPhone(phone).get();
        // Confirm password match
        if (newPassword.equals(confirmPassword)) {
            // Encode the passwords
            newPassword = passwordEncoder.encode(newPassword);
            user.setPassword(newPassword);
            userRepository.save(user);
            return new ResponseEntity<>("M???t kh???u thay ?????i th??nh c??ng", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("M???t kh???u kh??ng kh???p", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Send OTP to register owner.
     *
     * @param phone the phone number
     * @return
     */
    @Override
    public ResponseEntity<?> sendOTPRegister(String phone) {
        // Check used phone number
        Optional<User> userOptional = userRepository.findByPhone(phone);
        if (userOptional.isPresent()) { /* User found (phone number used) */
            return new ResponseEntity<>("S??? ??i???n tho???i ???? ???????c s??? d???ng", HttpStatus.BAD_REQUEST);
        } else {
            // Create OTP
            String OTP = "111";
            Otp otp = new Otp();
            otp.setPhoneNumber(phone);
            otp.setOtp(OTP);
            otpRepository.save(otp);
            // Send OTP

            return new ResponseEntity<>(OTP, HttpStatus.OK);
        }
    }

    /**
     * Verify OTP to register owner.
     *
     * @param verifyOtpDTO
     * @return
     */
    @Override
    public ResponseEntity<?> verifyOTPRegister(VerifyOtpDTO verifyOtpDTO) {
        // Check if the OTP match
        String phone = verifyOtpDTO.getPhone();
        String otpSend = verifyOtpDTO.getOTP();
        Otp otp = otpRepository.findByPhoneNumber(phone).get();
        if (otpSend.equals(otp.getOtp())) {      /* OTP match*/
            otpRepository.delete(otp);
            return new ResponseEntity<>("M?? OTP ???? ????ng", HttpStatus.OK);
        } else {                        /* OTP not match*/
            return new ResponseEntity<>("M?? OTP sai", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Re-send OTP register owner.
     *
     * @param phone
     * @return
     */
    @Override
    public ResponseEntity<?> resendOTPRegister(String phone) {
        Optional<Otp> otpOptional = otpRepository.findByPhoneNumber(phone);
        if (!otpOptional.isPresent()) { /* Not exist in database */
            // Create OTP
            String OTP = "111";
            Otp otp = new Otp();
            otp.setPhoneNumber(phone);
            otp.setOtp(OTP);
            otpRepository.save(otp);
            // Send OTP

            //
        } else { /* Exist in database, registering */
            // Create OTP
            String OTP = "111";
            Otp otp = otpOptional.get();
            otp.setPhoneNumber(phone);
            otp.setOtp(OTP);
            otpRepository.save(otp);
            // Send OTP

            //
        }
        return new ResponseEntity<>("???? g???i l???i m?? OTP", HttpStatus.OK);
    }
}
