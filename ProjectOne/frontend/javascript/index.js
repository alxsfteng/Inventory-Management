const warehouseURL = 'http://localhost:8080/warehouse';
const itemURL = 'http://localhost:8080/items';

let allWarehouses = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchWarehouses();

    document.getElementById('saveWarehouseBtn').addEventListener('click', () => {
        saveWarehouseChanges();
    });

    document.querySelector('.add-warehouse-btn').addEventListener('click', () => {
        $('#addWarehouseModal').modal('show');
    });

    document.getElementById('saveAddWarehouseBtn').addEventListener('click', () => {
        saveAddWarehouse();
    });

});

function fetchWarehouses() {
    fetch(warehouseURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch warehouses');
            }
            return response.json();
        })
        .then(warehouses => {
            warehouses.forEach(warehouse => {
                addWarehouseToTable(warehouse);
            });
        })
        .catch(error => {
            console.error('Error fetching warehouses:', error);
        });
}

document.getElementById('warehouseForm').addEventListener('submit', (event) => {
    event.preventDefault();

    let inputData = new FormData(document.getElementById('warehouseForm'));

    let newWarehouse = {
        name: inputData.get('warehouseName'),
        location: inputData.get('warehouseLocation'),
        maxCapacity: inputData.get('warehouseCapacity')
    };

    doPostRequest(warehouseURL, newWarehouse, addWarehouseToTable);
});

async function doPostRequest(url, data, callback) {
    let returnedData = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    let jsonData = await returnedData.json();

    callback(jsonData);

    document.getElementById('warehouseForm').reset();
    document.getElementById('itemForm').reset();
}

function addWarehouse() {
    let warehouseData = {
        name: document.getElementById('warehouseName').value,
        location: document.getElementById('warehouseLocation').value,
        maxCapacity: document.getElementById('maxCapacity').value
    };

    fetch(warehouseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(warehouseData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add warehouse');
        }
    })
    .then(newWarehouse => {
        addWarehouseToTable(newWarehouse);
        $('#warehouseModal').modal('hide'); 
    })
    .catch(error => {
        console.error('Error adding warehouse:', error);
    });
}

function addWarehouseToTable(warehouse) {
    let tr = document.createElement('tr');
    let id = document.createElement('td');
    let name = document.createElement('td');
    let location = document.createElement('td');
    let maxCapacity = document.createElement('td');
    let editBtn = document.createElement('td');
    let deleteBtn = document.createElement('td');
    let viewItemsBtn = document.createElement('td');

    id.innerText = warehouse.id;
    name.innerText = warehouse.name;
    location.innerText = warehouse.location;
    maxCapacity.innerText = warehouse.maxCapacity;

    editBtn.innerHTML =
        `<button class="btn btn-primary" onclick="editWarehouse(${warehouse.id})">Edit</button>`;

    deleteBtn.innerHTML =
        `<button class="btn btn-danger" onclick="deleteWarehouse(${warehouse.id})">Delete</button>`;

    viewItemsBtn.innerHTML =
        `<button class="btn btn-success" onclick="window.location.href='view-items.html?id=${warehouse.id}'">View Items</button>`; 

    tr.appendChild(id);
    tr.appendChild(name);
    tr.appendChild(location);
    tr.appendChild(maxCapacity);
    tr.appendChild(editBtn);
    tr.appendChild(deleteBtn);
    tr.appendChild(viewItemsBtn); 

    tr.setAttribute('id', 'TR' + warehouse.id);

    document.getElementById('warehouse-table-body').appendChild(tr);

    allWarehouses.push(warehouse);
}

function editWarehouse(warehouseId) {
    let warehouseToUpdate = allWarehouses.find(warehouse => warehouse.id === warehouseId);

    if (!warehouseToUpdate) {
        console.error('Warehouse not found.');
        return;
    }

    document.getElementById('warehouseId').value = warehouseToUpdate.id;
    document.getElementById('warehouseName').value = warehouseToUpdate.name;
    document.getElementById('warehouseLocation').value = warehouseToUpdate.location;
    document.getElementById('maxCapacity').value = warehouseToUpdate.maxCapacity;

    let editModal = new bootstrap.Modal(document.getElementById('warehouseModal'));
    editModal.show();
}

function deleteWarehouse(warehouseId) {
    let warehouseToDelete = allWarehouses.find(warehouse => warehouse.id === warehouseId);

    if (!warehouseToDelete) {
        console.error('Warehouse not found.');
        return;
    }

    if (confirm(`Are you sure you want to delete ${warehouseToDelete.name}?`)) {
        fetch(`${warehouseURL}/${warehouseId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    removeWarehouseFromTable(warehouseId);
                } else {
                    console.error('Failed to delete warehouse');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

function removeWarehouseFromTable(warehouseId) {
    document.getElementById('TR' + warehouseId).remove();

    allWarehouses = allWarehouses.filter(warehouse => warehouse.id !== warehouseId);
}

function saveWarehouseChanges() {
    let warehouseId = document.getElementById('warehouseId').value;
    let updatedWarehouse = {
        name: document.getElementById('warehouseName').value,
        location: document.getElementById('warehouseLocation').value,
        maxCapacity: document.getElementById('maxCapacity').value
    };

    fetch(`${warehouseURL}/${warehouseId}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWarehouse)
    })
    .then(response => {
        if (response.ok) {
            updateWarehouseInTable(warehouseId, updatedWarehouse);
            $('#warehouseModal').modal('hide'); 
            location.reload(true);
        } else {
            console.error('Failed to update warehouse:', response.status);
        }
    })
    .catch(error => {
        console.error('Error updating warehouse:', error);
    });
}

function saveAddWarehouse() {
    let addWarehouseData = {
        name: document.getElementById('addWarehouseName').value,
        location: document.getElementById('addWarehouseLocation').value,
        maxCapacity: document.getElementById('addWarehouseCapacity').value
    };

    fetch(warehouseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(addWarehouseData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add warehouse');
        }
    })
    .then(newWarehouse => {
        addWarehouseToTable(newWarehouse);
        $('#addWarehouseModal').modal('hide'); 
    })
    .catch(error => {
        console.error('Error adding warehouse:', error);
    });
}

function updateWarehouseInTable(warehouseId, updatedWarehouse) {
    let warehouseIndex = allWarehouses.findIndex(warehouse => warehouse.id === warehouseId);
    if (warehouseIndex !== -1) {
        allWarehouses[warehouseIndex] = updatedWarehouse;

        let trElement = document.getElementById('TR' + warehouseId);
        if (trElement) {
            trElement.querySelector('.warehouse-name').innerText = updatedWarehouse.name;
            trElement.querySelector('.warehouse-location').innerText = updatedWarehouse.location;
            trElement.querySelector('.warehouse-max-capacity').innerText = updatedWarehouse.maxCapacity;
        }
    }
}

function updateItemTable(items) {
    const itemTableBody = document.getElementById('item-table-body');
    itemTableBody.innerHTML = '';

    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.warehouse.name}</td>
            <td>
                <button class="btn btn-primary" onclick="editItem(${item.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
            </td>
        `;
        itemTableBody.appendChild(row);

    });
}

function viewItems(warehouseId) {
    fetch(`${itemURL}/warehouse/${warehouseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch items for the warehouse');
            }
            return response.json();
        })
        .then(items => {
            updateItemTable(items);
        })
        .catch(error => {
            console.error('Error fetching items for the warehouse:', error);
        });
}

