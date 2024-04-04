package com.skillstorm.projectone.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillstorm.projectone.models.Warehouse;
import com.skillstorm.projectone.repositories.WarehouseRepository;

@Service
public class WarehouseService {
    
    @Autowired
    private WarehouseRepository warehouseRepository;

    // Gets a warehouse by its Id
    public List<Warehouse> getAllWarehouses(){
        return warehouseRepository.findAll();
    }

    // Gets a warehouse by its Id
    public Warehouse getWareHouseById(int id){
        Optional<Warehouse> warehouse = warehouseRepository.findById(id);
        if(warehouse.isPresent()){
            return warehouse.get();
        } 
        return null;
    }

    // Saves a new warehouse
    public Warehouse saveWarehouse(Warehouse warehouse){
        return warehouseRepository.save(warehouse);
    }

    // Updates an existing warehouse
    public Warehouse updateWarehouse(int id, Warehouse updatedWarehouse){
        warehouseRepository.updateWarehouse(id, updatedWarehouse.getName(), updatedWarehouse.getLocation(), updatedWarehouse.getMaxCapacity());
        return getWareHouseById(id);
    }

    // Deletes an existing warehouse
    public void deleteWarehouse(int id){
        warehouseRepository.deleteById(id);
    }
}
