import React, { useState, useEffect } from 'react';
import { banquetAPI } from '../api/api';
import { Button, Card } from '../components/BaseComponents';

export const AdminBanquet = () => {
    const [halls, setHalls] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        capacity: '',
        basePrice: '',
        description: '',
        amenities: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await banquetAPI.getAllHalls();
            setHalls(response.data.banquetHalls);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching halls:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await banquetAPI.createHall({
                ...formData,
                amenities: formData.amenities.split(',').map(item => item.trim())
            });
            setShowForm(false);
            setFormData({
                name: '',
                capacity: '',
                basePrice: '',
                description: '',
                amenities: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error creating hall:', error);
            alert('Failed to create hall');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair text-gold">Manage Banquet Halls</h2>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Hall'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Hall Name"
                                className="p-2 border rounded"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Capacity"
                                className="p-2 border rounded"
                                value={formData.capacity}
                                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Base Price"
                                className="p-2 border rounded"
                                value={formData.basePrice}
                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                            />
                            <input
                                type="text"
                                placeholder="Amenities (comma separated)"
                                className="p-2 border rounded"
                                value={formData.amenities}
                                onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                            />
                        </div>
                        <textarea
                            placeholder="Description"
                            className="w-full p-2 border rounded"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <Button type="submit" variant="primary">Save Hall</Button>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {halls.map(hall => (
                    <Card key={hall._id}>
                        <h3 className="font-bold text-lg">{hall.name}</h3>
                        <p className="text-sm text-gray-600">Capacity: {hall.capacity}</p>
                        <p className="text-gold font-semibold">₹{hall.basePrice}</p>
                        <p className="text-sm text-gray-500 mt-2">{hall.description}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};
