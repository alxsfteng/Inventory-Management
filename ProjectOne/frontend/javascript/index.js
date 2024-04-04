const warehouseURL = 'http://localhost:8080/warehouse';
const itemURL = 'http://localhost:8080/items';

let allWarehouses = [];

// DOM event listener
document.addEventListener('DOMContentLoaded', () => {
    // Get and display warehouses
    fetchWarehouses();

    // Can click to save edited warehouse
    document.getElementById('saveWarehouseBtn').addEventListener('click', () => {
        saveWarehouseChanges();
    });

    // Can click to add warehouse
    document.querySelector('.add-warehouse-btn').addEventListener('click', () => {
        $('#addWarehouseModal').modal('show');
    });

    // Can click to save adding a warehouse
    document.getElementById('saveAddWarehouseBtn').addEventListener('click', () => {
        saveAddWarehouse();
    });

});

// Gets list of warehouses
function fetchWarehouses() {

    // Fetch warehousees with GET request
    fetch(warehouseURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch warehouses');
            }
            return response.json();
        })
        
        // If successful add the warehouse to the table
        .then(warehouses => {
            warehouses.forEach(warehouse => {
                addWarehouseToTable(warehouse);
            });
        })
        .catch(error => {
            console.error('Error fetching warehouses:', error);
        });
}

// EventListener to submit a warehouse form
document.getElementById('warehouseForm').addEventListener('submit', (event) => {
    event.preventDefault();

    // Get the data fropm warehouseFrom
    let inputData = new FormData(document.getElementById('warehouseForm'));
    let newWarehouse = {
        name: inputData.get('warehouseName'),
        location: inputData.get('warehouseLocation'),
        maxCapacity: inputData.get('warehouseCapacity')
    };

    // Do a POST request
    doPostRequest(warehouseURL, newWarehouse, addWarehouseToTable);
});

// Makes a POST request to a specific URL 
async function doPostRequest(url, data, callback) {
    // Sends the POST request
    let returnedData = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    let jsonData = await returnedData.json();

    callback(jsonData);

    // Reset the Forms
    document.getElementById('warehouseForm').reset();
    document.getElementById('itemForm').reset();
}

// Adds a new warehouse via POST request
function addWarehouse() {

    // Get warehouse data
    let warehouseData = {
        name: document.getElementById('warehouseName').value,
        location: document.getElementById('warehouseLocation').value,
        maxCapacity: document.getElementById('maxCapacity').value
    };

    // Sends POST request
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

    // if successfull then add to the warehosue table
    .then(newWarehouse => {
        addWarehouseToTable(newWarehouse);
        $('#warehouseModal').modal('hide'); 
    })
    .catch(error => {
        console.error('Error adding warehouse:', error);
    });
}

// Adds a warehouse to the table
function addWarehouseToTable(warehouse) {

    // Creating the table elements
    let tr = document.createElement('tr');
    let id = document.createElement('td');
    let name = document.createElement('td');
    let location = document.createElement('td');
    let maxCapacity = document.createElement('td');
    let editBtn = document.createElement('td');
    let deleteBtn = document.createElement('td');
    let viewItemsBtn = document.createElement('td');

    // Set innertext
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

    // Append the table informtion
    tr.appendChild(id);
    tr.appendChild(name);
    tr.appendChild(location);
    tr.appendChild(maxCapacity);
    tr.appendChild(editBtn);
    tr.appendChild(deleteBtn);
    tr.appendChild(viewItemsBtn); 

    tr.setAttribute('id', 'TR' + warehouse.id);

    document.getElementById('warehouse-table-body').appendChild(tr);

    // Populate warehouses array
    allWarehouses.push(warehouse);

    // Fetches the total quantity of items to compare to max capacity
    fetchCurrentQuantity(warehouse.id, maxCapacity);
}

// Display the modal to edit a warehouse
function editWarehouse(warehouseId) {

    // Find the warehouse based on warehouseId
    let warehouseToUpdate = allWarehouses.find(warehouse => warehouse.id === warehouseId);

    if (!warehouseToUpdate) {
        console.error('Warehouse not found.');
        return;
    }

    // Populate the input fields of the modal
    document.getElementById('warehouseId').value = warehouseToUpdate.id;
    document.getElementById('warehouseName').value = warehouseToUpdate.name;
    document.getElementById('warehouseLocation').value = warehouseToUpdate.location;
    document.getElementById('maxCapacity').value = warehouseToUpdate.maxCapacity;

    // Show the modal to edit the item
    let editModal = new bootstrap.Modal(document.getElementById('warehouseModal'));
    editModal.show();
}

// Deletse warehouse based on the warehouseId
function deleteWarehouse(warehouseId) {

    // Find the warehouseId
    let warehouseToDelete = allWarehouses.find(warehouse => warehouse.id === warehouseId);

    if (!warehouseToDelete) {
        console.error('Warehouse not found.');
        return;
    }

    // Confirm and delete the item
    if (confirm(`Are you sure you want to delete ${warehouseToDelete.name}?`)) {
        // Delete request 
        fetch(`${warehouseURL}/${warehouseId}`, {
                method: 'DELETE',
            })
            // Remove warehouse from table
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

// Removes warehouse from table based on warehouseId
function removeWarehouseFromTable(warehouseId) {
    document.getElementById('TR' + warehouseId).remove();

    allWarehouses = allWarehouses.filter(warehouse => warehouse.id !== warehouseId);
}

// Save warehouse changes with PUT request
function saveWarehouseChanges() {

    // Get warehouseId and get the data for that warehouse
    let warehouseId = document.getElementById('warehouseId').value;
    let updatedWarehouse = {
        name: document.getElementById('warehouseName').value,
        location: document.getElementById('warehouseLocation').value,
        maxCapacity: document.getElementById('maxCapacity').value
    };

    // PUT request to update warehouse
    fetch(`${warehouseURL}/${warehouseId}`, {
        method: 'PUT', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedWarehouse)
    })

    // Update the warehouse
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

// Save warehosue data with POST request
function saveAddWarehouse() {

    // Get the data of a new warehouse
    let addWarehouseData = {
        name: document.getElementById('addWarehouseName').value,
        location: document.getElementById('addWarehouseLocation').value,
        maxCapacity: document.getElementById('addWarehouseCapacity').value
    };

    // Make the POST request
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

    // Add warehouse to the table
    .then(newWarehouse => {
        addWarehouseToTable(newWarehouse);
        $('#addWarehouseModal').modal('hide'); 

        location.reload();
    })
    .catch(error => {
        console.error('Error adding warehouse:', error);
    });
}

// Updates warehouse
function updateWarehouseInTable(warehouseId, updatedWarehouse) {
    
    // Search allWarehouse array for the index of the updated warehouse
    let warehouseIndex = allWarehouses.findIndex(warehouse => warehouse.id === warehouseId);
    if (warehouseIndex !== -1) {
        allWarehouses[warehouseIndex] = updatedWarehouse;

        // Find the table row element and update the displayed warehouse data
        let trElement = document.getElementById('TR' + warehouseId);
        if (trElement) {
            trElement.querySelector('.warehouse-name').innerText = updatedWarehouse.name;
            trElement.querySelector('.warehouse-location').innerText = updatedWarehouse.location;
            trElement.querySelector('.warehouse-max-capacity').innerText = updatedWarehouse.maxCapacity;
        }
    }
}

// Updates the items to be viewed for each warehouse
function updateItemTable(items) {

    // Get the element where the items are displayed and clear the content
    const itemTableBody = document.getElementById('item-table-body');
    itemTableBody.innerHTML = '';

    // Loop through each item and populate the table
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

// Fetches and displays the items for a specific warehouse
function viewItems(warehouseId) {

    //Fetch the items for a warehouse
    fetch(`${itemURL}/warehouse/${warehouseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch items for the warehouse');
            }
            return response.json();
        })
        // Shows the items when viewed
        .then(items => {
            updateItemTable(items);
        })
        .catch(error => {
            console.error('Error fetching items for the warehouse:', error);
        });
}

// Fetches the current quantity of items for a warehouse
async function fetchCurrentQuantity(warehouseId, maxCapacityElement) {
    try {
        // Fetch the warehouse details 
        const warehouseResponse = await fetch(`http://localhost:8080/warehouse/${warehouseId}`);
        if (!warehouseResponse.ok) {
            throw new Error('Failed to fetch warehouse details');
        }
        const warehouseData = await warehouseResponse.json();
        const warehouseCapacity = warehouseData.maxCapacity;

        // fetch the items in the warehouse
        const itemsResponse = await fetch(`${itemURL}/item/warehouse/${warehouseId}`);
        if (!itemsResponse.ok) {
            throw new Error('Failed to fetch items for warehouse');
        }
        const currentItems = await itemsResponse.json();

        // Calculate the total quantity of items in the warehouse
        let totalQuantity = currentItems.reduce((total, item) => total + parseInt(item.quantity), 0);

        // Calculate and display the actual ratio 
        let ratio = `${totalQuantity} / ${warehouseCapacity}`;
        maxCapacityElement.innerText = ratio;
    } catch (error) {
        console.error('Error fetching current quantity:', error);
        maxCapacityElement.innerText = 'N/A'; 
    }
}

