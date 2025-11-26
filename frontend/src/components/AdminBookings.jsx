import React, { useState, useEffect } from 'react';
import { bookingAPI, banquetAPI, restaurantAPI } from '../api/api';
import { Card } from '../components/BaseComponents';

export const AdminBookings = () => {
    const [roomBookings, setRoomBookings] = useState([]);
    const [banquetBookings, setBanquetBookings] = useState([]);
    const [restaurantBookings, setRestaurantBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('rooms');

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const [roomRes, banquetRes, restaurantRes] = await Promise.all([
                bookingAPI.getAllBookings(),
                banquetAPI.getAllBookings(),
                restaurantAPI.getAllBookings(),
            ]);
            setRoomBookings(roomRes.data.bookings);
            setBanquetBookings(banquetRes.data.bookings);
            setRestaurantBookings(restaurantRes.data.bookings);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                <button
                    className={`pb-2 px-4 ${activeTab === 'rooms' ? 'border-b-2 border-gold text-gold font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('rooms')}
                >
                    Room Bookings
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'banquet' ? 'border-b-2 border-gold text-gold font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('banquet')}
                >
                    Banquet Bookings
                </button>
                <button
                    className={`pb-2 px-4 ${activeTab === 'restaurant' ? 'border-b-2 border-gold text-gold font-bold' : 'text-gray-500'}`}
                    onClick={() => setActiveTab('restaurant')}
                >
                    Restaurant Bookings
                </button>
            </div>

            <div className="space-y-4">
                {activeTab === 'rooms' && roomBookings.map(booking => (
                    <Card key={booking._id}>
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gold">{booking.bookingNumber}</h3>
                                <p className="text-sm">Guest: {booking.guest?.firstName} {booking.guest?.lastName}</p>
                                <p className="text-sm">Room: {booking.room?.roomNumber}</p>
                                <p className="text-sm">Dates: {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">₹{booking.totalPrice}</p>
                                <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}

                {activeTab === 'banquet' && banquetBookings.map(booking => (
                    <Card key={booking._id}>
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gold">{booking.bookingNumber}</h3>
                                <p className="text-sm">Guest: {booking.guest?.firstName} {booking.guest?.lastName}</p>
                                <p className="text-sm">Hall: {booking.banquetHall?.name}</p>
                                <p className="text-sm">Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
                                <p className="text-sm">Event: {booking.eventType}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">₹{booking.totalPrice}</p>
                                <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}

                {activeTab === 'restaurant' && restaurantBookings.map(booking => (
                    <Card key={booking._id}>
                        <div className="flex justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-gold">{booking.bookingNumber}</h3>
                                <p className="text-sm">Guest: {booking.guest?.firstName} {booking.guest?.lastName}</p>
                                <p className="text-sm">Table: {booking.table?.tableNumber}</p>
                                <p className="text-sm">Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                                <p className="text-sm">Time: {booking.timeSlot}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold">Guests: {booking.numberOfGuests}</p>
                                <span className={`px-2 py-1 rounded text-xs ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {booking.status}
                                </span>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
