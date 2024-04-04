package com.skillstorm.projectone.controllers;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.skillstorm.projectone.dtos.ItemDto;
import com.skillstorm.projectone.models.Item;
import com.skillstorm.projectone.services.ItemService;

@RestController
@RequestMapping("/items")
@CrossOrigin("http://127.0.0.1:5500")
public class ItemController {
    
    @Autowired
    private ItemService itemService;

    @GetMapping
    public ResponseEntity<List<Item>> getAllItems(){
        List<Item> items = itemService.getAllItems();
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Item> getItemById(@PathVariable int id){
        Item item = itemService.getItemById(id);
        return new ResponseEntity<>(item, HttpStatus.OK);
    }

    @GetMapping("/item/warehouse/{warehouseId}")
    public ResponseEntity<List<Item>> getItemsByWarehouseId(@PathVariable int warehouseId) {
        List<Item> items = itemService.getItemsByWarehouseId(warehouseId);
        return new ResponseEntity<>(items, HttpStatus.OK);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<List<ItemDto>> getItemsWithWarehouseName(@PathVariable int warehouseId) {
        List<ItemDto> itemsWithWarehouseName = itemService.getItemWithWarehouseName(warehouseId);
        return new ResponseEntity<List<ItemDto>>(itemsWithWarehouseName, HttpStatus.OK);
    }
    
    @PostMapping
    public ResponseEntity<Item> createItem(@RequestBody Item item){
        Item newItem = itemService.saveItem(item);
        return new ResponseEntity<>(newItem, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateItem(@PathVariable int id, @RequestParam String name, @RequestParam int quantity){
        int updatedCount = itemService.updateItem(id, name, quantity);
        if(updatedCount > 0){
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteItem(@PathVariable int id){
        itemService.deleteItem(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
