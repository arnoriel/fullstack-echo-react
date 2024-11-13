import React, { useState, useEffect } from 'react';

function ItemManager() {
    const [items, setItems] = useState([]);
    const [newItemName, setNewItemName] = useState('');
    const [editItem, setEditItem] = useState(null);

    // Fetch all items
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        const response = await fetch('http://localhost:8080/api/items');
        const data = await response.json();
        setItems(data);
    };

    // Create a new item
    const addItem = async () => {
        await fetch('http://localhost:8080/api/items', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ name: newItemName })
        });
        setNewItemName('');
        fetchItems();
    };

    // Update an existing item
    const updateItem = async (id) => {
        await fetch(`http://localhost:8080/api/items/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ name: editItem.name })
        });
        setEditItem(null);
        fetchItems();
    };

    // Delete an item
    const deleteItem = async (id) => {
        await fetch(`http://localhost:8080/api/items/${id}`, {
            method: 'DELETE'
        });
        fetchItems();
    };

    return (
        <div>
            <h2>Item Manager</h2>
            <div>
                <input
                    type="text"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder="New item name"
                />
                <button onClick={addItem}>Add Item</button>
            </div>
            <ul>
                {items.map((item) => (
                    <li key={item.id}>
                        {editItem && editItem.id === item.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editItem.name}
                                    onChange={(e) =>
                                        setEditItem({ ...editItem, name: e.target.value })
                                    }
                                />
                                <button onClick={() => updateItem(item.id)}>Save</button>
                                <button onClick={() => setEditItem(null)}>Cancel</button>
                            </>
                        ) : (
                            <>
                                {item.name}
                                <button onClick={() => setEditItem(item)}>Edit</button>
                                <button onClick={() => deleteItem(item.id)}>Delete</button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ItemManager;
