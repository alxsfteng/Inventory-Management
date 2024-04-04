package com.skillstorm.projectone.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.skillstorm.projectone.dtos.ItemDto;
import com.skillstorm.projectone.models.Item;
import com.skillstorm.projectone.repositories.ItemRepository;
import com.skillstorm.projectone.repositories.WarehouseRepository;

@Service
public class ItemService {

    @Autowired
    WarehouseRepository warehouseRepository;
    
    @Autowired
    private ItemRepository itemRepository;

    public List<Item> getAllItems(){
        return itemRepository.findAll();
    }

    public Item getItemById(int id){
        Optional<Item> item = itemRepository.findById(id);

        if(item.isPresent()){
            return item.get();
        }
        return null;
    }

    public List<Item> getItemsByWarehouseId(int warehouseId){
        return itemRepository.findByWarehouseId(warehouseId);
    }

    public List<ItemDto> getItemWithWarehouseName(int warehouseId){
        List<Item> items = itemRepository.findByWarehouseId(warehouseId);
        List<ItemDto> itemDtos = new ArrayList<>();
        for(Item item : items){
            ItemDto itemDto = new ItemDto();
            itemDto.setId(item.getId());
            itemDto.setName(item.getName());
            itemDto.setQuantity(item.getQuantity());
            itemDto.setWarehouseName(item.getWarehouse().getName());
            itemDtos.add(itemDto);
        }
        return itemDtos;
    }

    public Item saveItem(Item item){
        return itemRepository.save(item);
    }

    public int updateItem(int id, String newNam, int newQuantity){
        return itemRepository.updateItem(id, newNam, newQuantity);
    }
    
    public void deleteItem(int id){
        itemRepository.deleteById(id);
    }
}
