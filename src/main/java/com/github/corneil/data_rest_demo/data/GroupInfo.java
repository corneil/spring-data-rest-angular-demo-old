package com.github.corneil.data_rest_demo.data;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "groups", schema = "sd")
@Data
@EqualsAndHashCode(exclude = {"groupOwner", "id"})
public class GroupInfo {
    @NotNull
    @Column(unique = true)
    private String groupName;
    @NotNull
    private String description;
    @NotNull
    @ManyToOne(cascade = {CascadeType.ALL})
    private UserInfo groupOwner;
    @Id
    @GeneratedValue
    private Long id;
    public GroupInfo() {
        super();
    }
    public GroupInfo(String groupName, String description, UserInfo groupOwner) {
        super();
        this.groupName = groupName;
        this.description = description;
        this.groupOwner = groupOwner;
    }
}
