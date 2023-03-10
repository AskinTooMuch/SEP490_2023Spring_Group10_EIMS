/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 24/02/2023    1.0        DuongVV          First Deploy<br>
 */

package com.example.eims.utils;

import java.sql.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.concurrent.TimeUnit;

public class StringDealer {
    public StringDealer() {
    }

    /**
     * Trim spaces.
     *
     * @param str the string need to be trimmed
     * @return String after be trimmed
     */
    public String trimMax(String str) {
        return str.trim().replaceAll("\\s+"," ");
    }

    /**
     * Convert string to date type in format.
     *
     * @param str the date input in form of String
     * @return Date
     */
    public Date convertToDateAndFormat (String str) {
        Date date;
        try {
            date = new Date((new SimpleDateFormat("yyyy-MM-dd").parse(str)).getTime());
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        return date;
    }

    /**
     * Check if email is valid or not.
     *
     * @param email the input email
     * @return boolean value, true if email is valid, false if not
     */
    public boolean checkEmailRegex(String email){
        String regex = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$";
        return email.matches(regex);
    }

    /**
     * Check if phone number is valid or not.
     *
     * @param phone the input phone number
     * @return boolean value, true if phone number is valid, false if not
     */
    public boolean checkPhoneRegex(String phone){
        String regex = "^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$";
        return phone.matches(regex);
    }

    /**
     * Check if password is valid or not.
     *
     * @param password the password
     * @return boolean value, true if password is valid, false if not
     */
    public boolean checkPasswordRegex(String password){
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$";
        return password.matches(regex);
    }

    /**
     * Get difference in days between 2 dates.
     *
     * @param startDate
     * @param endDate
     * @return
     */
    public long dateDiff(Date startDate, Date endDate){
        long daysDiff = 0L;
        try {
            // calculating the difference b/w startDate and endDate

            long getDiff = endDate.getTime() - startDate.getTime();

            // using TimeUnit class from java.util.concurrent package
            daysDiff = TimeUnit.MILLISECONDS.toDays(getDiff);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return daysDiff;
    }
}
