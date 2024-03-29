/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE         Version     Author      DESCRIPTION<br>
 * 02/03/2023   1.0         ChucNV      First Deploy<br>
 * 02/03/2023   2.0         ChucNV      Implement signup service<br>
 * 23/03/2023   3.0         ChucNV      Update sign in code according to new security feature<br>
 * 29/03/2023   3.1         DuongVV     Disable sms <br>
 * 29/03/2023   3.2         ChucNV      Fix change password bugs and messages<br>
 */

package com.example.eims.service.impl;

import com.example.eims.dto.auth.*;
import com.example.eims.entity.*;
import com.example.eims.repository.*;
import com.example.eims.service.interfaces.IAuthService;
import com.example.eims.utils.SpeedSMS;
import com.example.eims.utils.StringDealer;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.configurationprocessor.json.JSONException;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class AuthServiceImpl implements IAuthService {
    @Autowired
    private final AuthenticationProvider authenticationProvider;
    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final FacilityRepository facilityRepository;
    @Autowired
    private final WorkInRepository workInRepository;
    @Autowired
    private final RegistrationRepository registrationRepository;
    @Autowired
    private final PasswordEncoder passwordEncoder;
    private final StringDealer stringDealer;

    public AuthServiceImpl(AuthenticationProvider authenticationProvider, UserRepository userRepository,
                           FacilityRepository facilityRepository, WorkInRepository workInRepository,
                           RegistrationRepository registrationRepository,
                           PasswordEncoder passwordEncoder) {
        this.authenticationProvider = authenticationProvider;
        this.userRepository = userRepository;
        this.facilityRepository = facilityRepository;
        this.workInRepository = workInRepository;
        this.registrationRepository = registrationRepository;
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
    public ResponseEntity<?> authenticateUser(HttpServletRequest request, HttpServletResponse response, LoginDTO loginDTO) {
        if (loginDTO.getPhone() == null || stringDealer.trimMax(loginDTO.getPhone()).equals("")) { /* Phone number is empty */
            return new ResponseEntity<>("Số điện thoại không được để trống", HttpStatus.BAD_REQUEST);
        }
        String phone = stringDealer.trimMax(loginDTO.getPhone());
        if (loginDTO.getPassword() == null || stringDealer.trimMax(loginDTO.getPassword()).equals("")) { /* Password is empty */
            return new ResponseEntity<>("Mật khẩu không được để trống", HttpStatus.BAD_REQUEST);
        }
        String password = stringDealer.trimMax(loginDTO.getPassword());
        loginDTO.setPassword(stringDealer.trimMax(loginDTO.getPassword()));
        loginDTO.setPhone(stringDealer.trimMax(loginDTO.getPhone()));
        Optional<User> userOpt = userRepository.findByPhone(phone);
        if (userOpt.isEmpty()) {
            return new ResponseEntity<>("Tài khoản hoặc mật khẩu sai", HttpStatus.BAD_REQUEST);
        }
        User user = userOpt.get();
        if (user.getRoles().get(0).getRoleId() == 2L) { // role is OWNER (have Facility)
            // Check status of registration
            // 0 - considering
            // 1 - rejected
            // 2 - approved
            Registration registration = registrationRepository.findByUserId(user.getUserId()).get();
            if (registration.getStatus() == 0L) { // status = 0 (considering)
                return new ResponseEntity<>("Đơn đăng ký chưa được chấp thuận", HttpStatus.BAD_REQUEST);
            }
            if (registration.getStatus() == 1L) { /* status = 1 (rejected) */
                return new ResponseEntity<>("Đơn đăng ký bị từ chối, liên hệ EIMS.contact để biết thêm thông tin",
                        HttpStatus.BAD_REQUEST);
            }
        }
        // Check status of Account
        if (user.getStatus() == 0) {
            return new ResponseEntity<>("Tài khoản đã bị vô hiệu hóa", HttpStatus.BAD_REQUEST);
        }
        if (user.getRoles().get(0).getRoleId() == 3L) { //*role is EMPLOYEE (work in Facility)
            WorkIn workIn = workInRepository.findByUserId(user.getUserId()).get();
            Long facilityId = workIn.getFacilityId();
            if (!facilityRepository.getStatusById(facilityId)) { // status = 0 (facility stopped running)
                return new ResponseEntity<>("Cơ sở đã dừng hoạt động", HttpStatus.BAD_REQUEST);
            }
        }
        //Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return new ResponseEntity<>("Mật khẩu hoặc tài khoản sai", HttpStatus.BAD_REQUEST);
        }

        //Authenticate the user
        Authentication auth = authenticationProvider.authenticate(
                new UsernamePasswordAuthenticationToken(phone, password));
        SecurityContextHolder.getContext().setAuthentication(auth);
        HttpSession session = request.getSession(true);
        session.setAttribute("key", "value");
        session.setAttribute("security-session", auth);
        System.out.println("Login: " + session.getId());
        System.out.println(SecurityContextHolder.getContext().getAuthentication().getAuthorities());

        // Set attribute to sessionDTO
        user = ((UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUser();
        SessionDTO sessionDTO = new SessionDTO();
        sessionDTO.setUserId(user.getUserId());
        Long userRole = user.getRoles().get(0).getRoleId();
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
            return new ResponseEntity<>("Tên không được để trống", HttpStatus.BAD_REQUEST);
        }
        // Date of birth
        if (signUpDTO.getUserDob() == null) { /* Date of birth is empty */
            return new ResponseEntity<>("Ngày sinh không được để trống", HttpStatus.BAD_REQUEST);
        }
        String sDate = stringDealer.trimMax(signUpDTO.getUserDob());
        if (sDate.equals("")) { /* Date of birth is empty */
            return new ResponseEntity<>("Ngày sinh không được để trống", HttpStatus.BAD_REQUEST);
        }
        Date date = stringDealer.convertToDateAndFormat(sDate);
        if (date.after(Date.valueOf(LocalDate.now()))) {
            return new ResponseEntity<>("Ngày sinh không hợp lệ", HttpStatus.BAD_REQUEST);
        }
        // Phone number
        String phone = stringDealer.trimMax(signUpDTO.getUserPhone());
        if (phone.equals("")) { /* Phone number is empty */
            return new ResponseEntity<>("Số điện thoại không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPhoneRegex(phone)) { /* Phone number is not valid*/
            return new ResponseEntity<>("Số điện thoại không đúng đinh dạng", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByPhone(phone)) {/* Phone number is existed*/
            return new ResponseEntity<>("Số điện thoại đã được sử dụng", HttpStatus.BAD_REQUEST);
        }
        // Email
        String email = stringDealer.trimMax(signUpDTO.getUserEmail());
        if ((!email.equals("")) && !stringDealer.checkEmailRegex(email)) { /* Email is not valid */
            return new ResponseEntity<>("Email không đúng định dạng", HttpStatus.BAD_REQUEST);
        }
        if (email.length() > 64) { /* Email is not valid*/
            return new ResponseEntity<>("Email không được dài hơn 64 kí tự", HttpStatus.BAD_REQUEST);
        }
        // Address
        String address = stringDealer.trimMax(signUpDTO.getUserAddress());
        if (address.equals("")) { /* Address is empty */
            return new ResponseEntity<>("Địa chỉ không được để trống", HttpStatus.BAD_REQUEST);
        }
        JSONObject addressObj;
        try {
            addressObj = new JSONObject(address);
            String city = stringDealer.trimMax((String) addressObj.get("city"));
            String district = stringDealer.trimMax((String) addressObj.get("district"));
            String ward = stringDealer.trimMax((String) addressObj.get("ward"));
            String street = stringDealer.trimMax((String) addressObj.get("street"));
            if (city == null || city.equals("")) {
                return new ResponseEntity<>("Thành phố không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (district == null || district.equals("")) {
                return new ResponseEntity<>("Quận/Huyện không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (ward == null || ward.equals("")) {
                return new ResponseEntity<>("Phường xã không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (street == null || street.equals("")) {
                return new ResponseEntity<>("Số nhà không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (street.length() > 30) {
                return new ResponseEntity<>("Số nhà không được quá 30 kí tự", HttpStatus.BAD_REQUEST);
            }
            addressObj = new JSONObject();
            addressObj.put("city", city);
            addressObj.put("district", district);
            addressObj.put("ward", ward);
            addressObj.put("street", street);
            address = addressObj.toString();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        // Password
        String password = stringDealer.trimMax(signUpDTO.getUserPassword());
        if (password.equals("")) { /* Password is empty */
            return new ResponseEntity<>("Mật khẩu không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPasswordRegex(password)) { /* Password is not valid */
            return new ResponseEntity<>("Mật khẩu không đúng định dạng", HttpStatus.BAD_REQUEST);
        }
        // Confirm password
        String rePassword = stringDealer.trimMax(signUpDTO.getUserRePassword());
        // Password match
        if (!password.equals(rePassword)) { /* Password not match */
            return new ResponseEntity<>("Mật khẩu không khớp", HttpStatus.BAD_REQUEST);
        }
        // Set attribute
        user.setUsername(username);
        user.setEmail(email);
        user.setDob(date);
        user.setPhone(phone);
        user.setAddress(address);
        List roleList = new ArrayList<Role>();
        roleList.add(new Role(2, "ROLE_OWNER", true));
        user.setRoles(roleList);     /* Role OWNER */
        user.setStatus(0);      /* Inactivated, need registration's approval */
        //Encode password
        user.setPassword(passwordEncoder.encode(password));
        // Facility
        Facility facility = new Facility();
        // Name
        String fName = stringDealer.trimMax(signUpDTO.getFacilityName());
        if (fName.equals("")) { /* Facility name is empty */
            return new ResponseEntity<>("Tên cơ sở không được để trống", HttpStatus.BAD_REQUEST);
        }
        facility.setFacilityName(fName);
        // Found date
        if (sDate == null) {
            return new ResponseEntity<>("Ngày thành lập không được để trống", HttpStatus.BAD_REQUEST);
        }
        sDate = stringDealer.trimMax(signUpDTO.getFacilityFoundDate());
        if (sDate.equals("")) {  /* Found date is empty */
            return new ResponseEntity<>("Ngày thành lập không được để trống", HttpStatus.BAD_REQUEST);
        }
        date = stringDealer.convertToDateAndFormat(sDate);
        if (date.after(Date.valueOf(LocalDate.now()))) {
            return new ResponseEntity<>("Ngày thành lập không hợp lệ", HttpStatus.BAD_REQUEST);
        }
        facility.setFacilityFoundDate(date);
        // Hotline (Using the same format with cellphone number)
        String hotline = stringDealer.trimMax(signUpDTO.getFacilityHotline());
        if (hotline.equals("")) { /* Hotline is empty */
            return new ResponseEntity<>("Hotline không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPhoneRegex(hotline)) { /* Hotline is not valid */
            return new ResponseEntity<>("Hotline không đúng định dạng", HttpStatus.BAD_REQUEST);
        }
        facility.setHotline(hotline);
        // Address
        String fAddress = stringDealer.trimMax(signUpDTO.getFacilityAddress());
        if (fAddress.equals("")) { /* Address is empty */
            return new ResponseEntity<>("Địa chỉ cơ sở không được để trống", HttpStatus.BAD_REQUEST);
        }
        JSONObject addressObjFaci;
        try {
            addressObjFaci = new JSONObject(fAddress);
            String city = stringDealer.trimMax((String) addressObjFaci.get("city"));
            String district = stringDealer.trimMax((String) addressObjFaci.get("district"));
            String ward = stringDealer.trimMax((String) addressObjFaci.get("ward"));
            String street = stringDealer.trimMax((String) addressObjFaci.get("street"));
            if (city == null || city.equals("")) {
                return new ResponseEntity<>("Thành phố không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (district == null || district.equals("")) {
                return new ResponseEntity<>("Quận/Huyện không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (ward == null || ward.equals("")) {
                return new ResponseEntity<>("Phường xã không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (street == null || street.equals("")) {
                return new ResponseEntity<>("Số nhà không được để trống", HttpStatus.BAD_REQUEST);
            }
            if (street.length() > 30) {
                return new ResponseEntity<>("Số nhà không được quá 30 kí tự", HttpStatus.BAD_REQUEST);
            }
            addressObjFaci = new JSONObject();
            addressObjFaci.put("city", city);
            addressObjFaci.put("district", district);
            addressObjFaci.put("ward", ward);
            addressObjFaci.put("street", street);
            fAddress = addressObj.toString();
        } catch (JSONException e) {
            throw new RuntimeException(e);
        }
        facility.setFacilityAddress(fAddress);
        // Business license number
        String licenseNumber = stringDealer.trimMax(signUpDTO.getBusinessLicenseNumber());
        if (licenseNumber.equals("")) { /* Business license number is empty */
            return new ResponseEntity<>("Số đăng kí kinh doanh không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (licenseNumber.length() > 10) {
            return new ResponseEntity<>("Số đăng kí kinh doanh không dài hơn 10 ký tự", HttpStatus.BAD_REQUEST);
        }
        facility.setBusinessLicenseNumber(licenseNumber);

        facility.setStatus(0);  /* Inactivated, need registration's approval */
        try {
            User returnUser = userRepository.save(user);
            facility.setUserId(returnUser.getUserId());
            try {
                facilityRepository.save(facility);
                // Registration
                Registration registration = new Registration();
                registration.setUserId(returnUser.getUserId());
                registration.setRegisterDate(Date.valueOf(LocalDate.now()));
                registration.setStatus(0);
                registrationRepository.save(registration);
                return new ResponseEntity<>("Đăng kí thành công, vui lòng đợi xác nhận tài khoản", HttpStatus.OK);
            } catch (IllegalArgumentException iae) {
                userRepository.delete(user);
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
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
        //Get passwords:
        String oldPassword = stringDealer.trimMax(changePasswordDTO.getPassword());
        String newPassword = stringDealer.trimMax(changePasswordDTO.getNewPassword());
        String reNewPassword = stringDealer.trimMax(changePasswordDTO.getReNewPassword());
        //Local variable for the user
        Optional<User> userOpt;
        //Check credentials, if not valid then return Bad request (403)
        if (oldPassword.equals("")) { /* Password is empty */
            return new ResponseEntity<>("Mật khẩu cũ không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (newPassword.equals("")) { /* Password is empty */
            return new ResponseEntity<>("Mật khẩu mới không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (reNewPassword.equals("")) { /* Password is empty */
            return new ResponseEntity<>("Xác nhận mật khẩu không được để trống", HttpStatus.BAD_REQUEST);
        }
        userOpt = userRepository.findByUserId(changePasswordDTO.getUserId());
        if (userOpt.isEmpty() ||
                !passwordEncoder.matches(oldPassword, userOpt.get().getPassword())) { /* Old password not match*/
            return new ResponseEntity<>("Mật khẩu cũ sai", HttpStatus.BAD_REQUEST);
        }
        if (newPassword.equals(oldPassword)) {
            return new ResponseEntity<>("Mật khẩu mới không được trùng mật khẩu cũ", HttpStatus.BAD_REQUEST);
        }
        if (!newPassword.equals(reNewPassword)) {
            return new ResponseEntity<>("Mật khẩu được nhập lại không trùng với mật khẩu mới", HttpStatus.BAD_REQUEST);
        }
        if ((newPassword.length() < 8) || (newPassword.length() > 20)) {
            return new ResponseEntity<>("Mật khẩu mới có độ dài từ 8 đến 20 ký tự", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPasswordRegex(newPassword)) { /* New password is not valid */
            return new ResponseEntity<>("Mật khẩu mới không đúng định dạng", HttpStatus.BAD_REQUEST);
        }

        //Encode the passwords
        newPassword = passwordEncoder.encode(newPassword);
        User user = userOpt.get();
        user.setPassword(newPassword);
        userRepository.save(user);
        return new ResponseEntity<>("Thay đổi mật khẩu thành công", HttpStatus.OK);
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
        String confirmPassword = stringDealer.trimMax(forgotPasswordDTO.getConfirmPassword());
        if (newPassword.equals("")) { /* Password is empty */
            return new ResponseEntity<>("Mật khẩu không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (confirmPassword.equals("")) { /* Confirm Password is empty */
            return new ResponseEntity<>("Xác nhận mật khẩu không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPasswordRegex(newPassword)) { /* Password is not valid */
            return new ResponseEntity<>("Mật khẩu mới không đúng định dạng", HttpStatus.BAD_REQUEST);
        }

        // Get user
        User user = userRepository.findByPhone(phone).get();
        String oldPassword = user.getPassword();
        if (passwordEncoder.matches(newPassword, oldPassword)) {
            return new ResponseEntity<>("Mật khẩu mới không được trùng mật khẩu cũ", HttpStatus.BAD_REQUEST);
        }
        // Confirm password match
        if (newPassword.equals(confirmPassword)) {
            // Encode the passwords
            newPassword = passwordEncoder.encode(newPassword);
            user.setPassword(newPassword);
            userRepository.save(user);
            return new ResponseEntity<>("Mật khẩu thay đổi thành công", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Mật khẩu không khớp", HttpStatus.BAD_REQUEST);
        }
    }


    /**
     * Check phone number when register account
     *
     * @param phone the phone number
     * @return
     */
    @Override
    public ResponseEntity<?> checkPhoneRegister(String phone) {
        phone = stringDealer.trimMax(phone);
        if (phone.equals("")) { // phone number empty
            return new ResponseEntity<>("Số điện thoại không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPhoneRegex(phone)) { // phone number invalid
            return new ResponseEntity<>("Số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST);
        }
        Optional<User> userOptional = userRepository.findByPhone(phone);
        if (userOptional.isPresent()) {
            return new ResponseEntity<>("Số điện thoại đã được sử dụng", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(1, HttpStatus.OK);
    }

    /**
     * Check phone number when reset password
     *
     * @param phone the phone number
     * @return
     */
    @Override
    public ResponseEntity<?> checkPhoneForgotPassword(String phone) {
        phone = stringDealer.trimMax(phone);
        if (phone.equals("")) { // phone number empty
            return new ResponseEntity<>("Số điện thoại không được để trống", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPhoneRegex(phone)) { // phone number invalid
            return new ResponseEntity<>("Số điện thoại không hợp lệ", HttpStatus.BAD_REQUEST);
        }
        Optional<User> userOptional = userRepository.findByPhone(phone);
        if (userOptional.isEmpty()) {
            return new ResponseEntity<>("Không tìm thấy tài khoản với số điện thoại đã nhập", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(1, HttpStatus.OK);
    }
}
