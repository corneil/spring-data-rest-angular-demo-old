package com.github.corneil.data_rest_demo.data;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "audit_entries")
@Data
@EqualsAndHashCode(exclude = {"auditInfo", "id"})
public class AuditEntry {
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<AuditInfo> auditInfo;
    @Temporal(value = TemporalType.TIMESTAMP)
    @NotNull
    private Date auditTime;
    @NotNull
    private String auditType;
    @NotNull
    private String eventType;
    @Id
    @GeneratedValue
    private Long id;
    public AuditEntry() {
        this.auditInfo = new ArrayList<AuditInfo>();
    }
    public AuditEntry(Date auditTime, String auditType, String eventType) {
        this.auditTime = auditTime;
        this.auditType = auditType;
        this.eventType = eventType;
        this.auditInfo = new ArrayList<AuditInfo>();
    }
}
