package com.github.corneil.data_rest_demo.data;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "location_updates")
@Data
@EqualsAndHashCode(exclude = {"id", "latX", "latY", "locDetail"})
public class LocationUpdate {
    @NotNull
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.EAGER)
    private DeviceInfo device;
    @Id
    @GeneratedValue
    private Long id;
    private double latX;
    private double latY;
    private String locDetail;
    @NotNull
    private Date locTime;
}
