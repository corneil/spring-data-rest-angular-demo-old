package com.github.corneil.data_rest_demo.data;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "group_members")
@Data
@EqualsAndHashCode(exclude = {"id", "enabled"})
public class GroupMember {
    @NotNull
    private Boolean enabled;
    @Id
    @GeneratedValue
    private Long id;
    @NotNull
    @ManyToOne
    private UserInfo member;
    @NotNull
    @ManyToOne
    private GroupInfo memberOfgroup;
    public GroupMember() {
        super();
    }
    public GroupMember(GroupInfo memberOfgroup, UserInfo member, Boolean enabled) {
        super();
        this.memberOfgroup = memberOfgroup;
        this.member = member;
        this.enabled = enabled;
    }
}
