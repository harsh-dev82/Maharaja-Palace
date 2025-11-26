import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../api/api';
import { Button, Card } from '../components/BaseComponents';

export const AdminRestaurant = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        tableNumber: '',
        capacity: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await restaurantAPI.getAllTables();
            setTables(response.data.tables);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching tables:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await restaurantAPI.createTable(formData);
            setShowForm(false);
            setFormData({
                tableNumber: '',
                capacity: '',
                location: '',
                description: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error creating table:', error);
            alert('Failed to create table');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair text-gold">Manage Restaurant Tables</h2>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Table'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Table Number"
                                className="p-2 border rounded"
                                value={formData.tableNumber}
                                onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Capacity"
                                className="p-2 border rounded"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Location (e.g., Window, Center)"
                                className="p-2 border rounded"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <textarea
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <Button type="submit" variant="primary">Save Table</Button>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tables.map(table => (
                    <Card key={table._id}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">Table {table.tableNumber}</h3>
                                <p className="text-sm text-gray-600">Capacity: {table.capacity}</p>
                                <p className="text-sm text-gray-500">{table.location}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${table.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {table.status}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
