package com.skillstorm.projectone;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.skillstorm.projectone.dtos.ItemDto;
import com.skillstorm.projectone.models.Item;
import com.skillstorm.projectone.models.Warehouse;
import com.skillstorm.projectone.repositories.ItemRepository;
import com.skillstorm.projectone.repositories.WarehouseRepository;
import com.skillstorm.projectone.services.ItemService;

@SpringBootTest
public class ItemServiceTest {

	@Autowired
    private ItemService itemService;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private WarehouseRepository warehouseRepository;

    private Warehouse warehouse;
    private Item savedItem;

    @BeforeEach
    public void setUp() {
        warehouseRepository.deleteAll(); 

        warehouse = new Warehouse("Test Warehouse", "Test Location", 100);
        warehouse = warehouseRepository.save(warehouse);

        Item newItem = new Item("Test Item", 10, warehouse);
        savedItem = itemRepository.save(newItem);
    }

    @AfterEach
    public void tearDown() {
        itemRepository.deleteAll();
        warehouseRepository.deleteAll();
    }

    @Test
    public void testGetAllItems() {
        List<Item> items = itemService.getAllItems();
        assertNotNull(items);
        assertEquals(1, items.size());
        assertEquals(savedItem, items.get(0));
    }

    @Test
    public void testGetItemById() {
        Item item = itemService.getItemById(savedItem.getId());
        assertNotNull(item);
        assertEquals(savedItem, item);

        Item nonExistentItem = itemService.getItemById(-1); 
        assertNull(nonExistentItem);
    }

    @Test
    public void testGetItemsByWarehouseId() {
        List<Item> items = itemService.getItemsByWarehouseId(warehouse.getId());
        assertNotNull(items);
        assertEquals(1, items.size());
        assertEquals(savedItem, items.get(0));

        List<Item> emptyItems = itemService.getItemsByWarehouseId(-1);
        assertNotNull(emptyItems);
        assertEquals(0, emptyItems.size());
    }

    @Test
    public void testGetItemWithWarehouseName() {
        List<ItemDto> itemDtos = itemService.getItemWithWarehouseName(warehouse.getId());
        assertNotNull(itemDtos);
        assertEquals(1, itemDtos.size());
        ItemDto itemDto = itemDtos.get(0);
        assertEquals(savedItem.getId(), itemDto.getId());
        assertEquals(savedItem.getName(), itemDto.getName());
        assertEquals(savedItem.getQuantity(), itemDto.getQuantity());
        assertEquals(warehouse.getName(), itemDto.getWarehouseName());

        List<ItemDto> emptyItemDtos = itemService.getItemWithWarehouseName(-1);
        assertNotNull(emptyItemDtos);
        assertEquals(0, emptyItemDtos.size());
    }

    @Test
    public void testSaveItem() {
        Item newItem = new Item("New Test Item", 20, warehouse);
        Item savedNewItem = itemService.saveItem(newItem);

        assertNotNull(savedNewItem);
        assertEquals(newItem.getName(), savedNewItem.getName());
        assertEquals(newItem.getQuantity(), savedNewItem.getQuantity());
        assertEquals(newItem.getWarehouse(), savedNewItem.getWarehouse());
    }

    @Test
    public void testUpdateItem() {
        String newName = "Updated Test Item";
        int newQuantity = 15;
        int updatedCount = itemService.updateItem(savedItem.getId(), newName, newQuantity);

        assertEquals(1, updatedCount);
        Item updatedItem = itemService.getItemById(savedItem.getId());
        assertNotNull(updatedItem);
        assertEquals(newName, updatedItem.getName());
        assertEquals(newQuantity, updatedItem.getQuantity());
    }

    @Test
    public void testDeleteItem() {
        int itemId = savedItem.getId();
        itemService.deleteItem(itemId);
        Item deletedItem = itemService.getItemById(itemId);
        assertNull(deletedItem);
    }
}