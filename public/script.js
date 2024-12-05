const apiUrl = 'http://localhost:3000/items';
let currentEditId = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchItems();

  document.getElementById('addItemBtn').addEventListener('click', () => {
    openModal();
  });

  document.getElementById('cancelBtn').addEventListener('click', () => {
    closeModal();
  });

  document.getElementById('saveItemBtn').addEventListener('click', () => {
    saveItem();
  });
});

function fetchItems() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const itemsList = document.getElementById('itemsList');
      itemsList.innerHTML = '';

      data.items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item');
        itemDiv.innerHTML = `
          <span>${item.name} - ${item.description || 'No description'}</span>
          <button onclick="editItem(${item.id})">Edit</button>
          <button onclick="deleteItem(${item.id})">Delete</button>
        `;
        itemsList.appendChild(itemDiv);
      });
    })
    .catch(error => console.error('Error fetching items:', error));
}

function openModal(item = {}) {
  document.getElementById('modalTitle').textContent = item.id ? 'Edit Item' : 'Add Item';
  document.getElementById('itemName').value = item.name || '';
  document.getElementById('itemDescription').value = item.description || '';
  currentEditId = item.id || null;
  document.getElementById('itemModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('itemModal').style.display = 'none';
  currentEditId = null;
}

function saveItem() {
  const name = document.getElementById('itemName').value;
  const description = document.getElementById('itemDescription').value;

  if (!name) {
    alert('Item name is required');
    return;
  }

  const itemData = { name, description };

  if (currentEditId) {
  
    fetch(`${apiUrl}/${currentEditId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    })
      .then(response => response.json())
      .then(() => {
        fetchItems();
        closeModal();
      })
      .catch(error => console.error('Error updating item:', error));
  } else {
    
    fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData),
    })
      .then(response => response.json())
      .then(() => {
        fetchItems();
        closeModal();
      })
      .catch(error => console.error('Error adding item:', error));
  }
}

function editItem(id) {
  fetch(`${apiUrl}/${id}`)
    .then(response => response.json())
    .then(item => {
      openModal(item);
    })
    .catch(error => console.error('Error fetching item:', error));
}

function deleteItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    fetch(`${apiUrl}/${id}`, { method: 'DELETE' })
      .then(() => {
        fetchItems();
      })
      .catch(error => console.error('Error deleting item:', error));
  }
}
