package com.skillstorm.projectone;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

import java.util.List;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import com.skillstorm.projectone.models.Warehouse;
import com.skillstorm.projectone.repositories.WarehouseRepository;
import com.skillstorm.projectone.services.WarehouseService;

@SpringBootTest
public class WarehouseServiceTest {

    @Autowired
    private WarehouseService warehouseService;

    @Autowired
    private WarehouseRepository warehouseRepository;

    private Warehouse savedWarehouse;

    @BeforeEach
    public void setUp() {
        warehouseRepository.deleteAll();

        Warehouse newWarehouse = new Warehouse("Test Warehouse", "Test Location", 100);
        savedWarehouse = warehouseRepository.save(newWarehouse);
    }

    @AfterEach
    public void tearDown() {
        warehouseRepository.deleteAll();
    }

    @Test
    public void testGetAllWarehouses() {
        List<Warehouse> warehouses = warehouseService.getAllWarehouses();
    assertNotNull(warehouses);
        assertEquals(1, warehouses.size());
        assertEquals(savedWarehouse, warehouses.get(0));
    }

    @Test
    public void testGetWarehouseById() {
        Warehouse warehouse = warehouseService.getWareHouseById(savedWarehouse.getId());
        assertNotNull(warehouse);
        assertEquals(savedWarehouse, warehouse);

        Warehouse nonExistentWarehouse = warehouseService.getWareHouseById(-1);
        assertNull(nonExistentWarehouse);
    }

    @Test
    public void testSaveWarehouse() {
        Warehouse newWarehouse = new Warehouse("New Test Warehouse", "New Test Location", 200);
        Warehouse savedNewWarehouse = warehouseService.saveWarehouse(newWarehouse);

        assertNotNull(savedNewWarehouse);
        assertEquals(newWarehouse.getName(), savedNewWarehouse.getName());
        assertEquals(newWarehouse.getLocation(), savedNewWarehouse.getLocation());
        assertEquals(newWarehouse.getMaxCapacity(), savedNewWarehouse.getMaxCapacity());
    }

    @Test
    public void testUpdateWarehouse() {
        String newName = "Updated Test Warehouse";
        String newLocation = "Updated Test Location";
        int newMaxCapacity = 300;

        Warehouse updatedWarehouse = new Warehouse(savedWarehouse.getId(), newName, newLocation, newMaxCapacity);
        Warehouse result = warehouseService.updateWarehouse(savedWarehouse.getId(), updatedWarehouse);

        assertNotNull(result);
        assertEquals(savedWarehouse.getId(), result.getId());
        assertEquals(newName, result.getName());
        assertEquals(newLocation, result.getLocation());
        assertEquals(newMaxCapacity, result.getMaxCapacity());
    }

    @Test
    public void testDeleteWarehouse() {
        int warehouseId = savedWarehouse.getId();
        warehouseService.deleteWarehouse(warehouseId);
        Warehouse deletedWarehouse = warehouseService.getWareHouseById(warehouseId);
        assertNull(deletedWarehouse);
    }
}
