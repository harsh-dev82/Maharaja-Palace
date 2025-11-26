import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingAPI, restaurantAPI, banquetAPI } from '../api/api';
import { Card } from '../components/BaseComponents';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [banquetBookings, setBanquetBookings] = useState([]);
  const [restaurantBookings, setRestaurantBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const [roomRes, banquetRes, restaurantRes] = await Promise.all([
        bookingAPI.getMyBookings(),
        banquetAPI.getMyBookings(),
        restaurantAPI.getMyBookings(),
      ]);

      setBookings(roomRes.data.bookings);
      setBanquetBookings(banquetRes.data.bookings);
      setRestaurantBookings(restaurantRes.data.bookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-playfair text-gold mb-2">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-lg text-lightText">Here's your dashboard overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-gold">{bookings.length}</div>
            <p className="text-lightText mt-2">Room Bookings</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-gold">{banquetBookings.length}</div>
            <p className="text-lightText mt-2">Banquet Bookings</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-4xl font-bold text-gold">{restaurantBookings.length}</div>
            <p className="text-lightText mt-2">Restaurant Bookings</p>
          </div>
        </Card>
      </div>

      {/* Room Bookings */}
      <section className="mb-12">
        <h2 className="text-3xl font-playfair text-gold mb-6">Room Bookings</h2>
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gold">
                      {booking.bookingNumber}
                    </h3>
                    <p className="text-sm text-lightText">{booking.room?.roomNumber}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-lightText">
                  <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
                  <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                  <p className="font-semibold">₹{booking.totalPrice}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-lightText">No room bookings yet</p>
        )}
      </section>

      {/* Banquet Bookings */}
      <section className="mb-12">
        <h2 className="text-3xl font-playfair text-gold mb-6">Banquet Bookings</h2>
        {banquetBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banquetBookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gold">
                      {booking.bookingNumber}
                    </h3>
                    <p className="text-sm text-lightText capitalize">{booking.eventType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-lightText">
                  <p>Date: {new Date(booking.eventDate).toLocaleDateString()}</p>
                  <p>Guests: {booking.expectedGuests}</p>
                  <p className="font-semibold">₹{booking.totalPrice}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-lightText">No banquet bookings yet</p>
        )}
      </section>

      {/* Restaurant Bookings */}
      <section>
        <h2 className="text-3xl font-playfair text-gold mb-6">Restaurant Bookings</h2>
        {restaurantBookings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurantBookings.map((booking) => (
              <Card key={booking._id}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gold">
                      {booking.bookingNumber}
                    </h3>
                    <p className="text-sm text-lightText capitalize">{booking.timeSlot.replace('_', ' ')}</p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-semibold ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-lightText">
                  <p>Date: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  <p>Guests: {booking.numberOfGuests}</p>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-lightText">No restaurant bookings yet</p>
        )}
      </section>
    </div>
  );
};
