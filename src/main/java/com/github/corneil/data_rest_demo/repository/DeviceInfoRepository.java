package com.github.corneil.data_rest_demo.repository;

import com.github.corneil.data_rest_demo.data.DeviceInfo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(collectionResourceRel = "devices", path = "devices", itemResourceRel = "device")
public interface DeviceInfoRepository extends CrudRepository<DeviceInfo, Long> {
    DeviceInfo findOneByDeviceId(@Param("deviceId") String deviceId);
}
