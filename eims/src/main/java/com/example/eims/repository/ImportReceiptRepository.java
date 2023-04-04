/*
 * Copyright (C) 2023, FPT University <br>
 * SEP490 - SEP490_G10 <br>
 * EIMS <br>
 * Eggs Incubating Management System <br>
 *
 * Record of change:<br>
 * DATE          Version    Author           DESCRIPTION<br>
 * 15/03/2023    1.0        DuongVV          First Deploy<br>
 */

package com.example.eims.repository;

import com.example.eims.entity.ImportReceipt;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

public interface ImportReceiptRepository extends JpaRepository<ImportReceipt, Long> {
    Optional<List<ImportReceipt>> findByFacilityId(Long facilityId);
    Optional<List<ImportReceipt>> findByUserId(Long userId);
    Optional<List<ImportReceipt>> findBySupplierId(Long supplierId);
    Optional<ImportReceipt> findByImportId(Long importId);
    @Query(value = "SELECT supplier_id, SUM(total) as total, SUM(paid) as paid from eims.import_receipt " +
            "WHERE user_id = ?1 GROUP BY supplier_id", nativeQuery = true)
    Optional<List<Objects>> importStatistic(Long userId);
    Page<ImportReceipt> findAllByUserId(Long userId, Pageable pageable);
    Page<ImportReceipt> findAllBySupplierId(Long supplierId, Pageable pageable);
    @Query(value = "select distinct year(import_date) as YEAR from eims.import_receipt where supplier_id = ?2 and user_id = ?1 order by YEAR DESC;\n", nativeQuery = true)
    Optional<List<String>> getImportReceiptYear(Long userId, Long supplierId);
}
