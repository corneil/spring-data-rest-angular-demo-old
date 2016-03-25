package com.github.corneil.data_rest_demo.data;

import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "audit_info")
@Data
public class AuditInfo {
    private String afterValue;
    private String beforeValue;
    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    private String name;
    public AuditInfo(String name, String beforeValue, String afterValue) {
        this.name = name;
        this.beforeValue = beforeValue;
        this.afterValue = afterValue;
    }
    public AuditInfo() {
    }
    public AuditInfo(String name, String afterValue) {
        this.name = name;
        this.afterValue = afterValue;
    }
    @Override
    public int hashCode() {
        return name.hashCode();
    }
    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        AuditInfo auditInfo = (AuditInfo) o;
        return name.equals(auditInfo.name);
    }
}
