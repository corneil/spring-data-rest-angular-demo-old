package com.github.corneil.data_rest_demo.data;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "devices")
@Data
@EqualsAndHashCode(exclude = {"deviceName", "id"})
public class DeviceInfo {
    @NotNull
    @Column(unique = true)
    private String deviceId;
    private String deviceName;
    @Id
    @GeneratedValue
    private Long id;
}
