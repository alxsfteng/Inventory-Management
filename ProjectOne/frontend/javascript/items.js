// URL for items
const itemURL = 'http://localhost:8080/items';

// Array to store items
let allItems = [];

// Event Listener for DOM content loaded
document.addEventListener('DOMContentLoaded', async () => {
    //Gets items for allItems array
    fetchItems();

    // Gets warehouseId from url
    const urlParams = new URLSearchParams(window.location.search);
    const warehouseId = urlParams.get('id');

    // Gets items for warehouseId if it exists
    if (warehouseId) {
        try {
            fetchItemsByWarehouseId(warehouseId);
        } catch (error) {
            console.error('Error fetching items:', error);
        }
    } else {
        console.error('Warehouse ID not found in URL parameters.');
    }

    // Event listeners for saving and editing items
    document.getElementById('saveAddItemBtn').addEventListener('click', saveItem);
    document.getElementById('saveEditItemBtn').addEventListener('click', saveEditedItem);

    // Add event listener for opening the edit item modal
    document.getElementById('openEditItemModalBtn')?.addEventListener('click', openEditItemModal);

    // Updates the total item/max capacity ratio
    updateTotalQuantity();
});

// Fetches all items
async function fetchItems() {
    try {
        const response = await fetch(itemURL);
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        const items = await response.json();
        allItems = items;
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

// Fetches warehouseId from items
async function fetchWarehouseIdFromItems() {
    try {
        const response = await fetch(itemURL);
        if (!response.ok) {
            throw new Error('Failed to fetch items');
        }
        const items = await response.json();
        if (items.length === 0) {
            throw new Error('No items found');
        }
        return items[0].warehouse_id;
    } catch (error) {
        throw error;
    }
}

// Make a POST Request
async function doPostRequest(url, data, callback) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Failed to create item');
        }

        const jsonData = await response.json();
        callback(jsonData);
        document.getElementById('addItemForm').reset();
    } catch (error) {
        console.error('Error creating item:', error);
        alert('Failed to create item. Please try again.');
    }
}

// Event listener for submitting the add item form
document.getElementById('addItemForm').addEventListener('submit', (event) => {
    event.preventDefault();
    let inputData = new FormData(document.getElementById('addItemForm'));
    let newItem = {
        name: inputData.get('itemNameModal'),
        quantity: inputData.get('itemQuantityModal'),
        warehouse_id: inputData.get('itemIdModal')
    };
    if (!newItem.warehouse_id) {
        console.error('Invalid warehouse ID for item:', newItem);
        return;
    }
    doPostRequest(itemURL, newItem, addItemToTable);
});

// Fetches items by warehouseId
function fetchItemsByWarehouseId(warehouseId) {
    fetch(`${itemURL}/item/warehouse/${warehouseId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch items for warehouse');
            }
            return response.json();
        })
        .then(items => {
            displayItems(items);
        })
        .catch(error => {
            console.error('Error fetching items:', error);
        });
}

// Add items to table
function addItemToTable(item) {

    // Create each element
    let tr = document.createElement('tr');
    let id = document.createElement('td');
    let name = document.createElement('td');
    let quantity = document.createElement('td');
    let warehouseName = document.createElement('td');
    let editBtn = document.createElement('td');
    let deleteBtn = document.createElement('td');

    // Apply each element
    id.innerText = item.id;
    name.innerText = item.name;
    quantity.innerText = item.quantity;
    warehouseName.innerText = item.warehouse.name;

    editBtn.innerHTML =
        `<button class="btn btn-primary" onclick="editItem(${item.id})">Edit</button>`;

    deleteBtn.innerHTML =
        `<button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>`;

    tr.appendChild(id);
    tr.appendChild(name);
    tr.appendChild(quantity);
    tr.appendChild(warehouseName);
    tr.appendChild(editBtn);
    tr.appendChild(deleteBtn);

    tr.setAttribute('id', 'TR' + item.id);

    document.getElementById('item-table-body').appendChild(tr);

    // Populate allItems array
    allItems.push(item);
}

// Saves a new item
async function saveItem(event) {
    event.preventDefault();

    // Grabs save element button
    const buttonElement = document.getElementById('saveAddItemBtn');
    if (!buttonElement) {
        console.error('Button element not found.');
        return;
    }

    // Gets warehouseId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const warehouseId = urlParams.get('id');
    if (!warehouseId) {
        console.error('Warehouse ID not found in URL parameters.');
        return;
    }

    // Validates the item form inputs
    if (!validateItemForm()) {
        return;
    }

    try {
        // Fetch warehouse details and current items for the warehouse
        const warehouseResponse = await fetch(`http://localhost:8080/warehouse/${warehouseId}`);
        if (!warehouseResponse.ok) {
            throw new Error('Failed to fetch warehouse details');
        }
        const warehouseData = await warehouseResponse.json();
        const warehouseCapacity = warehouseData.maxCapacity;

        const itemsResponse = await fetch(`${itemURL}/item/warehouse/${warehouseId}`);
        if (!itemsResponse.ok) {
            throw new Error('Failed to fetch items for warehouse');
        }
        const currentItems = await itemsResponse.json();

        // Calculate total quantity of items in each warehouse
        let totalQuantity = currentItems.reduce((total, item) => total + parseInt(item.quantity), 0);

        const formData = new FormData(document.getElementById('addItemForm'));
        const newItemQuantity = parseInt(formData.get('itemQuantityModal'));

        // Checks if adding a new item exceeds its warehouse capacity
        if (totalQuantity + newItemQuantity > warehouseCapacity) {
            alert(`Adding this item exceeds the warehouse maximum capacity of ${warehouseData.maxCapacity}.`);
            return;
        }

        // Prepares data for the new item
        const warehouseDetails = {
            id: warehouseData.id,
            name: warehouseData.name,
            location: warehouseData.location,
            maxCapacity: warehouseData.maxCapacity
        };

        const newItem = {
            name: formData.get('itemNameModal'),
            quantity: newItemQuantity,
            warehouse: warehouseDetails
        };

        // Makes a POST request to create the new item
        const response = await fetch(itemURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newItem)
        });

        if (!response.ok) {
            throw new Error('Failed to create item');
        }

        const item = await response.json();
        console.log('Item added successfully:', item);
        addItemToTable(item);

        // Hide the add item modal and reload the page
        const modal = document.getElementById('addItemModal');
        if (modal) {
            const bootstrapModal = new bootstrap.Modal(modal);
            bootstrapModal.hide();
            window.location.reload();
        } else {
            console.error('Modal element not found.');
        }

        resetItemForm();
    } catch (error) {
        console.error('Error creating item:', error);
        alert('Failed to create item. Please try again.');
    }
}

// Edits an item
function editItem(itemId) {
    console.log(allItems);

    // Finds items to update from Id
    let itemToUpdate = allItems.find(item => item.id === itemId);

    if (!itemToUpdate) {
        console.error(`Item not found with ID: ${itemId}`);
        return;
    }

    // Sets values for item modal
    document.getElementById('editItemId').value = itemToUpdate.id;
    document.getElementById('editItemName').value = itemToUpdate.name;
    document.getElementById('editItemQuantity').value = itemToUpdate.quantity;

    // Show modal
    let editModal = new bootstrap.Modal(document.getElementById('editItemModal'));
    editModal.show();
}

// Saves an edited item
async function saveEditedItem(event) {
    event.preventDefault();

    //Get form data 
    const formData = new FormData(document.getElementById('editItemForm'));

    // Create an object for the edited item
    const editedItem = {
        name: formData.get('editItemName'),
        quantity: parseInt(formData.get('editItemQuantity'))
    };

    // Gets the edited item's id
    const itemId = formData.get('editItemId');

    try {
        // Fetches item details
        const itemResponse = await fetch(`${itemURL}/${itemId}`);
        if (!itemResponse.ok) {
            throw new Error('Failed to fetch item details');
        }
        const itemData = await itemResponse.json();
        console.log("Item data:", itemData);

        // Gets warehouseId for a specific item
        const warehouseId = itemData.warehouse.id;
        console.log("Warehouse ID:", warehouseId);

        // Fetches the details of a warehouse associated with the item
        const warehouseResponse = await fetch(`http://localhost:8080/warehouse/${warehouseId}`);
        if (!warehouseResponse.ok) {
            throw new Error('Failed to fetch warehouse details');
        }
        const warehouseData = await warehouseResponse.json();
        console.log("Warehouse data:", warehouseData);

        // Fetches the current items in a specific warehouse
        const itemsResponse = await fetch(`${itemURL}/warehouse/${warehouseId}`);
        if (!itemsResponse.ok) {
            throw new Error('Failed to fetch items for warehouse');
        }
        const currentItems = await itemsResponse.json();
        console.log("Current items in the warehouse:", currentItems);

        // Calculate total quantity of items after editing
        let totalQuantity = currentItems.reduce((total, item) => {
            if (item.id === itemData.id) {
                return total + editedItem.quantity;
            } else {
                return total + parseInt(item.quantity);
            }
        }, 0);
        console.log("Total quantity:", totalQuantity);

        // Calculate the remaining capacity
        const remainingCapacity = warehouseData.maxCapacity - totalQuantity;
        console.log("Remaining capacity:", remainingCapacity);

        // Check if editing the item exceeds warehosue capacity
        if (totalQuantity > warehouseData.maxCapacity) {
            alert(`Editing this item exceeds the warehouse maximum capacity of ${warehouseData.maxCapacity}.`);
            return;
        }

        // Make a PUT request to update the item
        const response = await fetch(`${itemURL}/${itemId}?name=${editedItem.name}&quantity=${editedItem.quantity}`, {
            method: 'PUT'
        });

        // Update the total quantity after editing makes sure the PUT request was successful
        if (response.ok) {
            console.log('Item updated successfully.');
            updateTotalQuantity();
            location.reload();
        } else {
            console.error('Failed to update item.');
        }
    } catch (error) {
        console.error('Error updating item:', error);
    }
}

// Deletes an item
async function deleteItem(itemId) {
    let itemToDelete = allItems.find(item => item.id === itemId);

    if (!itemToDelete) {
        console.error('Item not found.');
        return;
    }

    // Fetches the item and checks the id and updates the total quantity
    if (confirm(`Are you sure you want to delete ${itemToDelete.name}?`)) {
        fetch(`${itemURL}/${itemId}`, {
            method: 'DELETE',
        })
            // If successfull then the item will be removed from the table and update the total quantity
            .then(response => {
                if (response.ok) {
                    console.log('Item deleted success');
                    removeItemFromTable(itemId);
                    updateTotalQuantity();

                    location.reload();
                } else {
                    console.error('Failed to delete item');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
}

// Removes item from a table
function removeItemFromTable(itemId) {
    const elementToRemove = document.getElementById('TR' + itemId);

    // Checks if the element exists and removes it from the table and allItems array
    if (elementToRemove) {
        elementToRemove.remove();
        allItems = allItems.filter(item => item.id !== itemId);
        console.log('Item removed successfully.');
    } else {
        console.error('Element not found with ID:', 'TR' + itemId);
    }
}

// Validates the add/edit item form
function validateItemForm() {
    // Get input elemtns for the items
    const itemNameInput = document.getElementById('itemNameModal');
    const itemQuantityInput = document.getElementById('itemQuantityModal');

    // Trim the values to make sure formating is correct
    const itemName = itemNameInput ? itemNameInput.value.trim() : '';
    const itemQuantity = itemQuantityInput ? itemQuantityInput.value.trim() : '';

    // Alert by checking if the field is empty
    if (itemName === '' || itemQuantity === '') {
        alert('Please fill in all required fields.');
        return false;
    }
    return true;
}

// Displays the items in a table
function displayItems(items) {
    const itemTableBody = document.getElementById('item-table-body');
    itemTableBody.innerHTML = '';

    // Gets each item and adds its attributes
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

// Resets the add item form
function resetItemForm() {
    document.getElementById('addItemForm').reset();
}

// Open the edit item modal
function openEditItemModal() {
    const editItemModal = new bootstrap.Modal(document.getElementById('editItemModal'));
    editItemModal.show();
}

// Updates the total quantity and max capacity ratio
async function updateTotalQuantity() {
    // Get warehouseId
    const urlParams = new URLSearchParams(window.location.search);
    const warehouseId = urlParams.get('id');

    // Checks if the warehouseId is there
    if (!warehouseId) {
        console.error('Warehouse ID not found in URL parameters.');
        return;
    }

    try {
        // Fetches the warehouse details 
        const warehouseResponse = await fetch(`http://localhost:8080/warehouse/${warehouseId}`);
        if (!warehouseResponse.ok) {
            throw new Error('Failed to fetch warehouse details');
        }
        const warehouseData = await warehouseResponse.json();
        const warehouseCapacity = warehouseData.maxCapacity;

        // Fetches the item details for a specific warehosue
        const itemsResponse = await fetch(`${itemURL}/item/warehouse/${warehouseId}`);
        if (!itemsResponse.ok) {
            throw new Error('Failed to fetch items for warehouse');
        }
        const currentItems = await itemsResponse.json();

        // Calculate the total quantity of items in the warehouse
        let totalQuantity = currentItems.reduce((total, item) => total + parseInt(item.quantity), 0);
        // Calculate the ratio of total quantity to max capacity
        let ratio = `${totalQuantity} / ${warehouseCapacity}`;

        // Update HTML
        document.getElementById('totalQuantityCapacity').innerText = ratio;
    } catch (error) {
        console.error('Error updating total quantity:', error);
    }
}