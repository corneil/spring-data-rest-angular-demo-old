package com.github.corneil.data_rest_demo.data;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "users", schema = "sd")
@Data
@EqualsAndHashCode(exclude = {"dateOfBirth", "emailAddress", "fullName", "id"})
public class UserInfo {
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(style = "M-")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private Date dateOfBirth;
    private String emailAddress;
    @NotNull
    private String fullName;
    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @Column(unique = true)
    private String userId;
    public UserInfo() {
        super();
    }
    public UserInfo(String userId, String fullName) {
        super();
        this.userId = userId;
        this.fullName = fullName;
    }
}
