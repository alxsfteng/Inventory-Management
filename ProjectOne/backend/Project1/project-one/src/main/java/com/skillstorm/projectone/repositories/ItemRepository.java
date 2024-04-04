package com.skillstorm.projectone.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.skillstorm.projectone.models.Item;

import jakarta.transaction.Transactional;
import java.util.List;


@Repository
public interface ItemRepository extends JpaRepository<Item, Integer>{
    
    // Updates the Item
    @Transactional
    @Modifying
    @Query("UPDATE Item i SET i.name = :newName, i.quantity = :newQuantity WHERE i.id = :id")
    int updateItem(@Param("id") int id, @Param("newName") String newName, @Param("newQuantity") int newQuantity);

    // Get a list of items by warehouseId
    List<Item> findByWarehouseId(int warehouseId);
    
}
