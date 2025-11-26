import React, { useState, useEffect } from 'react';
import { roomAPI } from '../api/api';
import { Button, Card } from '../components/BaseComponents';

export const AdminRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        roomNumber: '',
        roomType: '',
        floor: '',
        currentPrice: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [roomsRes, typesRes] = await Promise.all([
                roomAPI.getAllRooms(),
                roomAPI.getRoomTypes(),
            ]);
            setRooms(roomsRes.data.rooms);
            setRoomTypes(typesRes.data.roomTypes);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await roomAPI.createRoom(formData);
            setShowForm(false);
            setFormData({
                roomNumber: '',
                roomType: '',
                floor: '',
                currentPrice: '',
            });
            fetchData();
        } catch (error) {
            console.error('Error creating room:', error);
            alert('Failed to create room');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-playfair text-gold">Manage Rooms</h2>
                <Button variant="primary" onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : 'Add New Room'}
                </Button>
            </div>

            {showForm && (
                <Card className="mb-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Room Number"
                                className="p-2 border rounded"
                                value={formData.roomNumber}
                                onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                            />
                            <select
                                className="p-2 border rounded"
                                value={formData.roomType}
                                onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                            >
                                <option value="">Select Type</option>
                                {roomTypes.map(type => (
                                    <option key={type._id} value={type._id}>{type.name}</option>
                                ))}
                            </select>
                            <input
                                type="number"
                                placeholder="Floor"
                                className="p-2 border rounded"
                                value={formData.floor}
                                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Price"
                                className="p-2 border rounded"
                                value={formData.currentPrice}
                                onChange={(e) => setFormData({ ...formData, currentPrice: e.target.value })}
                            />
                        </div>
                        <Button type="submit" variant="primary">Save Room</Button>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map(room => (
                    <Card key={room._id}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg">{room.roomNumber}</h3>
                                <p className="text-sm text-gray-600">{room.roomType?.name}</p>
                                <p className="text-gold font-semibold">₹{room.currentPrice}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${room.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                {room.status}
                            </span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
