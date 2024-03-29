/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE         Version     Author      DESCRIPTION<br>
 * 04/03/2023   1.0         DuongVV     First Deploy<br>
 * 29/03/2023   3.1         DuongVV     Disable sms <br>
 */

package com.example.eims.service.impl;

import com.example.eims.dto.registration.RegistrationInforDTO;
import com.example.eims.dto.registration.RegistrationListItemDTO;
import com.example.eims.entity.*;
import com.example.eims.repository.*;
import com.example.eims.service.interfaces.IRegistrationService;
import com.example.eims.utils.SpeedSMS;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RegistrationServiceImpl implements IRegistrationService {

    @Autowired
    private final UserRepository userRepository;
    @Autowired
    private final RegistrationRepository registrationRepository;
    @Autowired
    private final FacilityRepository facilityRepository;
    @Autowired
    private final CustomerRepository customerRepository;
    @Autowired
    private final SubscriptionRepository subscriptionRepository;
    @Autowired
    private final UserSubscriptionRepository userSubscriptionRepository;
    private final SpeedSMS speedSMS;
    private final String SENDER = "61522b07d22251db";
    @PersistenceContext
    private EntityManager em;

    public RegistrationServiceImpl(UserRepository userRepository, RegistrationRepository registrationRepository,
                                   FacilityRepository facilityRepository, CustomerRepository customerRepository,
                                   SubscriptionRepository subscriptionRepository,
                                   UserSubscriptionRepository userSubscriptionRepository,
                                   EntityManager em) {
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
        this.facilityRepository = facilityRepository;
        this.customerRepository = customerRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.userSubscriptionRepository = userSubscriptionRepository;
        this.speedSMS = new SpeedSMS();
        this.em = em;
    }

    /**
     * View list registration of owners.
     *
     * @param status status of the registration
     * @return
     */
    @Override
    public ResponseEntity<?> viewListRegistration(int status) {
        Query query = em.createNamedQuery("getRegistrationListByStatus");
        query.setParameter(1, status); /* status = 0 (considering list)*/
        List<RegistrationListItemDTO> registrationListItemDTOList = query.getResultList();
        return new ResponseEntity<>(registrationListItemDTOList, HttpStatus.OK);
    }

    /**
     * View a registration of owner.
     *
     * @param userId the id of the owner
     * @return
     */
    @Override
    public ResponseEntity<?> viewRegistration(Long userId) {
        Query query = em.createNamedQuery("getRegistrationInforForUser");
        query.setParameter(1, userId);
        try {
            RegistrationInforDTO registrationInforDTO = (RegistrationInforDTO) query.getSingleResult();
            return new ResponseEntity<>(registrationInforDTO, HttpStatus.OK);
        } catch (NoResultException e) {
            return new ResponseEntity<>("Đơn đăng ký không tồn tại", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Approve or Decline owner's registration.
     *
     * @param userId   id of the user
     * @param approval is the decision of approval
     * @return
     */
    @Override
    @Transactional
    public ResponseEntity<?> registrationApproval(Long userId, Long facilityId, boolean approval) throws IOException {
        int status = (approval ? 2 : 1); /*1-rejected 2-approved */
        User user;
        Optional<Registration> registrationOptional = registrationRepository.findByUserId(userId);
        if (!registrationOptional.isPresent()) {
            return new ResponseEntity<>("Đơn đăng ký không tồn tại", HttpStatus.BAD_REQUEST);
        }
        if (registrationOptional.get().getStatus() != 0) {
            return new ResponseEntity<>("Đơn đăng ký đã được chấp thuận hoặc đã bị từ chối", HttpStatus.BAD_REQUEST);
        }
        Registration registration = registrationOptional.get();
        if (approval) {  /* Approve registration */
            // Change status of registration
            registration.setStatus(status);
            registrationRepository.save(registration);
            // Change status of Owner's account
            Optional<User> userOptional = userRepository.findByUserId(userId);
            if (userOptional.isPresent()) {
                user = userOptional.get();
                user.setStatus(status);
                userRepository.save(user);
            } else {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
            // Change status of Facility
            Optional<Facility> facilityOptional = facilityRepository.findByUserId(userId);
            if (facilityOptional.isPresent()) {
                Facility facility = facilityOptional.get();
                facility.setStatus(1);
                facilityRepository.save(facility);
            } else {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
            // Create Khách lẻ
            Customer customer = new Customer();
            customer.setCustomerName("Khách lẻ");
            customer.setCustomerAddress("Khách lẻ");
            customer.setCustomerPhone("Khách lẻ");
            customer.setCustomerMail("Khách lẻ");
            customer.setStatus(1);
            customer.setUserId(userId);
            customerRepository.save(customer);

            //
            Subscription subscription = subscriptionRepository.findBySubscriptionId(1).get();

            UserSubscription userSubscription = new UserSubscription();
            userSubscription.setFacilityId(facilityId);
            userSubscription.setSubscriptionId(subscription.getSubscriptionId());
            userSubscription.setSubscribeDate(Date.valueOf(LocalDate.now()));
            userSubscription.setExpireDate(Date.valueOf(LocalDate.now().plusDays(subscription.getDuration())));
            userSubscription.setPaid(0);
            userSubscription.setStatus(true);

            userSubscriptionRepository.save(userSubscription);
            //  Send message to Owner
            String content = "Đơn đăng ký của bạn đã được chấp thuận! Chào mừng đến với EIMS.";
            //String userInfo = speedSMS.getUserInfo();
            //String response = speedSMS.sendSMS(user.getPhone(), content, 5, SENDER);
            System.out.println(content);
            //
            return new ResponseEntity<>("Đã chấp thuận đơn đăng ký", HttpStatus.OK);
        } else { /* Decline registration */
            // Change status of registration
            registration.setStatus(status);
            registrationRepository.save(registration);
            // Change status of Owner's account
            Optional<User> userOptional = userRepository.findByUserId(userId);
            if (userOptional.isPresent()) {
                user = userOptional.get();
                user.setStatus(status);
                userRepository.save(user);
                //  Send mess to Owner
                String content = "Đơn đăng ký của bạn với hệ thống EIMS đã bị từ chối! Vui lòng liên hệ eims.contact " +
                        "để biết thêm thông tin chi tiết.";
                //String userInfo = speedSMS.getUserInfo();
                //String response = speedSMS.sendSMS(user.getPhone(), content, 5, SENDER);
                System.out.println(content);
            } else {
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            return new ResponseEntity<>("Đã từ chối đơn đăng ký", HttpStatus.OK);
        }
    }
}
