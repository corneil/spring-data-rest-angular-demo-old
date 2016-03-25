package com.github.corneil.data_rest_demo.repository;

import com.github.corneil.data_rest_demo.data.LocationUpdate;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Date;
import java.util.List;

@RepositoryRestResource(collectionResourceRel = "locationUpdates",
                        itemResourceRel = "locationUpdate",
                        path = "location-update")
public interface LocationUpdateRepository extends CrudRepository<LocationUpdate, Long> {
    List<LocationUpdate> findByDevice_DeviceIdAndLocTimeBetween(@Param("deviceId") String deviceId,
                                                                @Param("startDate") Date startDate,
                                                                @Param("endDate") Date endDate);
}
