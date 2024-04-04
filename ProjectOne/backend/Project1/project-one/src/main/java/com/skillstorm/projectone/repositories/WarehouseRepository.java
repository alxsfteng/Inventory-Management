package com.skillstorm.projectone.repositories;

import org.springframework.stereotype.Repository;
import com.skillstorm.projectone.models.Warehouse;

import jakarta.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface WarehouseRepository extends JpaRepository<Warehouse, Integer>{
    
    // Update the warehouse
    @Transactional
    @Modifying
    @Query("UPDATE Warehouse w SET w.name = :newName, w.location = :newLocation, w.maxCapacity = :newMaxCapacity WHERE w.id = :id")
    int updateWarehouse(@Param("id") int id, @Param("newName") String newName, @Param("newLocation") String newLocation, @Param("newMaxCapacity") int newMaxCapacity);
    
}
