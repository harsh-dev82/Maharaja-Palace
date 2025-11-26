import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/BaseComponents';
import { bookingAPI, banquetAPI, restaurantAPI, roomAPI } from '../api/api';

export const BookingPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user } = useAuth();

    const bookingType = searchParams.get('type');
    const resourceId = searchParams.get('roomId') || searchParams.get('hallId') || searchParams.get('tableId');

    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Form State
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [guests, setGuests] = useState(1);
    const [specialRequests, setSpecialRequests] = useState('');
    const [eventType, setEventType] = useState('Wedding');
    const [setupType, setSetupType] = useState('Round Tables');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: location } });
            return;
        }

        const fetchResource = async () => {
            try {
                let response;
                if (bookingType === 'room') {
                    response = await roomAPI.getRoomById(resourceId);
                    setResource(response.data.room);
                } else if (bookingType === 'banquet') {
                    response = await banquetAPI.getHallById(resourceId);
                    setResource(response.data.banquetHall);
                } else if (bookingType === 'restaurant') {
                    response = await restaurantAPI.getTableById(resourceId);
                    setResource(response.data.table);
                }
                setLoading(false);
            } catch (err) {
                setError('Failed to load booking details');
                setLoading(false);
            }
        };

        if (resourceId) {
            fetchResource();
        }
    }, [isAuthenticated, navigate, location, bookingType, resourceId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (bookingType === 'room') {
                await bookingAPI.createBooking({
                    room: resourceId,
                    checkInDate,
                    checkOutDate,
                    numberOfGuests: guests,
                    roomRate: resource.currentPrice, // Assuming room has currentPrice
                    specialRequests
                });
            } else if (bookingType === 'banquet') {
                await banquetAPI.createBooking({
                    banquetHall: resourceId,
                    eventDate,
                    eventType,
                    expectedGuests: guests,
                    setupType,
                    hallRate: resource.basePrice, // Assuming hall has basePrice
                    specialRequirements: specialRequests
                });
            } else if (bookingType === 'restaurant') {
                await restaurantAPI.createBooking({
                    table: resourceId,
                    bookingDate,
                    timeSlot,
                    numberOfGuests: guests,
                    specialRequests
                });
            }
            setSuccess(true);
            setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;
    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (success) return (
        <div className="text-center py-20">
            <h2 className="text-3xl text-gold font-playfair mb-4">Booking Confirmed!</h2>
            <p>Redirecting to dashboard...</p>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gold font-playfair mb-8 text-center">
                Complete Your Booking
            </h1>

            <div className="bg-white p-8 rounded-lg shadow-lg border border-gold/20">
                <div className="mb-6 border-b border-gray-200 pb-4">
                    <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
                    <p className="text-gray-600">Type: <span className="capitalize">{bookingType}</span></p>
                    {resource && (
                        <div className="mt-2">
                            <p className="font-medium text-gold">{resource.name || resource.roomNumber || resource.tableNumber}</p>
                            <p className="text-sm text-gray-500">{resource.description}</p>
                            {resource.currentPrice && <p className="text-sm font-semibold">Price: ₹{resource.currentPrice}/night</p>}
                            {resource.basePrice && <p className="text-sm font-semibold">Base Price: ₹{resource.basePrice}</p>}
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {bookingType === 'room' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                                        value={checkInDate}
                                        onChange={(e) => setCheckInDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                                        value={checkOutDate}
                                        onChange={(e) => setCheckOutDate(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {bookingType === 'banquet' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                                    value={eventDate}
                                    onChange={(e) => setEventDate(e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                                        value={eventType}
                                        onChange={(e) => setEventType(e.target.value)}
                                    >
                                        <option>Wedding</option>
                                        <option>Conference</option>
                                        <option>Birthday</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Setup Type</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                                        value={setupType}
                                        onChange={(e) => setSetupType(e.target.value)}
                                    >
                                        <option>Round Tables</option>
                                        <option>Theater Style</option>
                                        <option>U-Shape</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {bookingType === 'restaurant' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                                        value={bookingDate}
                                        onChange={(e) => setBookingDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                                    <select
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                                        value={timeSlot}
                                        onChange={(e) => setTimeSlot(e.target.value)}
                                    >
                                        <option value="">Select Time</option>
                                        <option value="12:00 PM">12:00 PM</option>
                                        <option value="1:00 PM">1:00 PM</option>
                                        <option value="7:00 PM">7:00 PM</option>
                                        <option value="8:00 PM">8:00 PM</option>
                                        <option value="9:00 PM">9:00 PM</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value))}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded focus:ring-gold focus:border-gold"
                            rows="3"
                            value={specialRequests}
                            onChange={(e) => setSpecialRequests(e.target.value)}
                        ></textarea>
                    </div>

                    <Button variant="primary" className="w-full" type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
