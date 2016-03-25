package com.github.corneil.data_rest_demo.repository;

import com.github.corneil.data_rest_demo.data.UserInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "users", path = "users", itemResourceRel = "user")
public interface UserRepository extends CrudRepository<UserInfo, Long> {
    UserInfo findOneByUserId(@Param("userId") String userId);
}
