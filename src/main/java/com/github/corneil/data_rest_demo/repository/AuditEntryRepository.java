package com.github.corneil.data_rest_demo.repository;

import com.github.corneil.data_rest_demo.data.AuditEntry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Date;
import java.util.List;
@RepositoryRestResource(collectionResourceRel = "auditEntries", path = "audit-entries", itemResourceRel = "auditEntry")
public interface AuditEntryRepository extends PagingAndSortingRepository<AuditEntry, Long> {
    List<AuditEntry> findByAuditTimeBetweenOrderByAuditTimeDesc(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    Page<AuditEntry> findByAuditTypeAndAuditTimeBetween(@Param("auditType") String auditType,
                                                        @Param("startDate") Date startDate,
                                                        @Param("endDate") Date endDate,
                                                        Pageable pageable);
    List<AuditEntry> findByAuditTypeAndAuditTimeBetweenOrderByAuditTimeDesc(@Param("auditType") String auditType,
                                                                            @Param("startDate") Date startDate,
                                                                            @Param("endDate") Date endDate);
}
