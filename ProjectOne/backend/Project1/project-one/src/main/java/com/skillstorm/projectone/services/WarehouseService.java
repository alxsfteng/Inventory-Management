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

    public List<Warehouse> getAllWarehouses(){
        return warehouseRepository.findAll();
    }

    public Warehouse getWareHouseById(int id){
        Optional<Warehouse> warehouse = warehouseRepository.findById(id);
        if(warehouse.isPresent()){
            return warehouse.get();
        } 
        return null;
    }

    public Warehouse saveWarehouse(Warehouse warehouse){
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(int id, Warehouse updatedWarehouse){
        warehouseRepository.updateWarehouse(id, updatedWarehouse.getName(), updatedWarehouse.getLocation(), updatedWarehouse.getMaxCapacity());
        return getWareHouseById(id);
    }

    public void deleteWarehouse(int id){
        warehouseRepository.deleteById(id);
    }
}
