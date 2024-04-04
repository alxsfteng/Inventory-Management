package com.skillstorm.projectone.controllers;

import java.net.http.HttpResponse.ResponseInfo;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.projectone.models.Warehouse;
import com.skillstorm.projectone.services.WarehouseService;

@RestController
@RequestMapping("/warehouse")
@CrossOrigin("http://127.0.0.1:5500")
public class WarehouseController {
    
    @Autowired
    private WarehouseService warehouseService;

    // Gets all warehouses
    @GetMapping
    public ResponseEntity<List<Warehouse>> getAllWareHouses(){
        List<Warehouse> warehouses = warehouseService.getAllWarehouses();
        return new ResponseEntity<>(warehouses, HttpStatus.OK);
    }

    // Gets a warehouse by warehouseId
    @GetMapping("/{id}")
    public ResponseEntity<Warehouse> getWarehouseById(@PathVariable int id){
        Warehouse warehouse = warehouseService.getWareHouseById(id);
        return new ResponseEntity<>(warehouse, HttpStatus.OK);
    }

    // Creates a warehouse
    @PostMapping
    public ResponseEntity<Warehouse> createWarehouse(@RequestBody Warehouse warehouse){
        Warehouse newWarehouse = warehouseService.saveWarehouse(warehouse);
        return new ResponseEntity<>(newWarehouse, HttpStatus.CREATED);
    }

    // Updates a warehouse
    @PutMapping("/{id}")
    public ResponseEntity<Warehouse> updateWarehouse(@PathVariable int id, @RequestBody Warehouse updWarehouse){
        Warehouse updated = warehouseService.updateWarehouse(id, updWarehouse);
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }

    // Delete a warehouse
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWarehouse(@PathVariable int id){
        warehouseService.deleteWarehouse(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
