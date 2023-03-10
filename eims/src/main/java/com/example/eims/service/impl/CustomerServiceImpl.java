/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE         Version     Author      DESCRIPTION<br>
 * 02/03/2023   1.0         DuongVV     First Deploy<br>
 */

package com.example.eims.service.impl;

import com.example.eims.dto.customer.CreateCustomerDTO;
import com.example.eims.dto.customer.UpdateCustomerDTO;
import com.example.eims.entity.Customer;
import com.example.eims.repository.CustomerRepository;
import com.example.eims.repository.UserRepository;
import com.example.eims.service.interfaces.ICustomerService;
import com.example.eims.utils.StringDealer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerServiceImpl implements ICustomerService {

    @Autowired
    private final CustomerRepository customerRepository;
    @Autowired
    private final UserRepository userRepository;
    private StringDealer stringDealer = new StringDealer();

    public CustomerServiceImpl(CustomerRepository customerRepository, UserRepository userRepository) {
        this.customerRepository = customerRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get all of user's customers.
     *
     * @param userId the id of current logged-in user.
     * @return list of Customers
     */
    @Override
    public ResponseEntity<?> getAllCustomer(Long userId) {
        // Get all customers of the current User
        Optional<List<Customer>> customers = customerRepository.findByUserId(userId);
        if (customers.isPresent()) {
            return new ResponseEntity<>(customers.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
    }

    /**
     * Get a customer.
     *
     * @param customerId the id of the customer
     * @return a customer
     */
    @Override
    public ResponseEntity<?> getCustomer(Long customerId) {
        // Get a customer of the current User
        Optional<Customer> customer = customerRepository.findByCustomerId(customerId);
        if (customer.isPresent()) {
            return new ResponseEntity<>(customer.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Create a customer of a user.
     *
     * @param createCustomerDTO contains the user's id, name, phone number and address of the customer
     * @return
     */
    @Override
    public ResponseEntity<?> createCustomer(CreateCustomerDTO createCustomerDTO) {
        // Check if Owner's account is still activated
        Long userId = createCustomerDTO.getUserId();
        int accountStatus = (userRepository.getStatusByUserId(userId)? 1:0);
        if (accountStatus == 0) { /* status = 0 (deactivated) */
            return new ResponseEntity<>("T??i kho???n ???? b??? v?? hi???u h??a", HttpStatus.BAD_REQUEST);
        }
        // Check blank input
        // Name
        String name = stringDealer.trimMax(createCustomerDTO.getCustomerName());
        if (name.equals("")) { /* Supplier name is empty */
            return new ResponseEntity<>("T??n kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        // Phone number
        String phone = stringDealer.trimMax(createCustomerDTO.getCustomerPhone());
        if (phone.equals("")) { /* Phone number is empty */
            return new ResponseEntity<>("S??? ??i???n tho???i kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPhoneRegex(phone)) { /* Phone number is not valid */
            return new ResponseEntity<>("S??? ??i???n tho???i kh??ng h???p l???", HttpStatus.BAD_REQUEST);
        }
        // Check phone number existed or not
        boolean existed = customerRepository.existsByCustomerPhoneAndUserId(phone, userId);
        if (existed) { /* if phone number existed */
            return new ResponseEntity<>("S??? ??i???n tho???i ???? ???????c s??? d???ng", HttpStatus.BAD_REQUEST);
        }
        // Email
        String mail = stringDealer.trimMax(createCustomerDTO.getCustomerMail());
        if ((!mail.equals("")) && !stringDealer.checkEmailRegex(mail)) { /* Supplier email is not valid */
            return new ResponseEntity<>("Email kh??ng h???p l???", HttpStatus.BAD_REQUEST);
        }
        // Address
        String address = stringDealer.trimMax(createCustomerDTO.getCustomerAddress());
        if (address.equals("")) { /* Address is empty */
            return new ResponseEntity<>("?????a ch??? kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }

        // Retrieve customer information and create new customer
        Customer customer = new Customer();
        customer.setUserId(createCustomerDTO.getUserId());
        customer.setCustomerName(name);
        customer.setCustomerPhone(phone);
        customer.setCustomerAddress(address);
        customer.setCustomerMail(mail);
        customer.setStatus(1);
        // Save
        customerRepository.save(customer);
        return new ResponseEntity<>("Th??m kh??ch h??ng m???i th??nh c??ng", HttpStatus.OK);
    }

    /**
     * Show form to update a customer of a user.
     *
     * @param customerId the id of the customer
     * @return a customer
     */
    @Override
    public ResponseEntity<?> showFormUpdate(Long customerId) {
        // Get a customer of the current User
        Optional<Customer> customer = customerRepository.findByCustomerId(customerId);
        if (customer.isPresent()) {
            return new ResponseEntity<>(customer.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Update a customer of a user.
     *
     * @param updateCustomerDTO contains the new name, phone number and address, email and status of the customer
     * @return
     */
    @Override
    public ResponseEntity<?> updateCustomer(UpdateCustomerDTO updateCustomerDTO) {
        Long userId = updateCustomerDTO.getUserId();
        // Name
        String name = stringDealer.trimMax(updateCustomerDTO.getCustomerName());
        if (name.equals("")) { /* Supplier name is empty */
            return new ResponseEntity<>("T??n kh??ch h??ng kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        // Phone number
        String newPhone = stringDealer.trimMax(updateCustomerDTO.getCustomerPhone());
        if (newPhone.equals("")) { /* Phone number is empty */
            return new ResponseEntity<>("S??? ??i???n tho???i kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        if (!stringDealer.checkPhoneRegex(newPhone)) { /* Phone number is not valid */
            return new ResponseEntity<>("S??? ??i???n tho???i kh??ng h???p l???", HttpStatus.BAD_REQUEST);
        }
        String oldPhone = customerRepository.findCustomerPhoneById(updateCustomerDTO.getCustomerId());
        if (!newPhone.equals(oldPhone)) {
            boolean existed = customerRepository.existsByCustomerPhoneAndUserId(newPhone, userId);
            if (existed) {
                return new ResponseEntity<>("S??? ??i???n tho???i ???? ???????c s??? d???ng", HttpStatus.BAD_REQUEST);
            }
        }
        // Email
        String mail = stringDealer.trimMax(updateCustomerDTO.getCustomerMail());
        if ((!mail.equals("")) && !stringDealer.checkEmailRegex(mail)) { /* Supplier email is not valid */
            return new ResponseEntity<>("Email kh??ng h???p l???", HttpStatus.BAD_REQUEST);
        }
        // Address
        String address = stringDealer.trimMax(updateCustomerDTO.getCustomerAddress());
        if (address.equals("")) { /* Address is empty */
            return new ResponseEntity<>("?????a ch??? kh??ng ???????c ????? tr???ng", HttpStatus.BAD_REQUEST);
        }
        // Status
        int status = updateCustomerDTO.getStatus();
        Optional<Customer> customerOptional = customerRepository.findByCustomerId(updateCustomerDTO.getCustomerId());
        if (customerOptional.isPresent()) {
            // Retrieve customer's new information
            Customer customer = customerOptional.get();
            customer.setCustomerName(name);
            customer.setCustomerPhone(newPhone);
            customer.setCustomerAddress(address);
            customer.setCustomerMail(mail);
            customer.setStatus(status);
            // Save
            customerRepository.save(customer);
            return new ResponseEntity<>("C???p nh???t th??ng tin kh??ch h??ng th??nh c??ng", HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Search customer of the user by their name or phone number.
     *
     * @param userId the id of current logged-in user
     * @param key    the search key (name or phone number)
     * @return list of customers match the key search item.
     */
    @Override
    public ResponseEntity<?> searchCustomer(Long userId, String key) {
        // Trim spaces
        StringDealer stringDealer = new StringDealer();
        key = stringDealer.trimMax(key);
        // Search
        Optional<List<Customer>> customerList = customerRepository.searchByUsernameOrPhone(userId, key);
        if (customerList.isPresent()) {
            return new ResponseEntity<>(customerList.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * Get all of user's customers with Paging.
     *
     * @param userId the id of current logged-in user.
     * @param page   the page number
     * @param size   the size of page
     * @param sort   sorting type
     * @return list of Customers
     */
    @Override
    public ResponseEntity<?> getAllCustomerPaging(Long userId, Integer page, Integer size, String sort) {
        // Get sorting type
        Sort sortable = null;
        if (sort.equals("ASC")) {
            sortable = Sort.by("customerId").ascending();
        }
        if (sort.equals("DESC")) {
            sortable = Sort.by("customerId").descending();
        }
        // Get all customers of the current User with Paging
        Page<Customer> customerPage = customerRepository.findAllByUserId(userId, PageRequest.of(page, size, sortable));
        return new ResponseEntity<>(customerPage, HttpStatus.OK);
    }
}
