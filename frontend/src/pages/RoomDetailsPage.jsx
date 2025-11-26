import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/BaseComponents';
// import { getRoomById } from '../api/roomApi'; // To be implemented

export const RoomDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Mock data for now
        const fetchRoom = async () => {
            // const data = await getRoomById(id);
            // setRoom(data);
            setRoom({
                id: id,
                name: 'Deluxe Suite',
                description: 'A luxurious suite with a king-size bed and a beautiful view.',
                price: 5000,
                images: ['https://via.placeholder.com/800x400'],
                amenities: ['WiFi', 'AC', 'TV', 'Mini Bar'],
            });
            setLoading(false);
        };
        fetchRoom();
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading...</div>;
    if (!room) return <div className="text-center py-20">Room not found</div>;

    const handleBookNow = () => {
        navigate(`/booking?type=room&roomId=${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img src={room.images[0]} alt={room.name} className="w-full h-96 object-cover rounded-lg shadow-lg" />
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-gold font-playfair mb-4">{room.name}</h1>
                    <p className="text-gray-600 mb-6">{room.description}</p>
                    <div className="mb-6">
                        <h3 className="text-xl font-semibold mb-2">Amenities</h3>
                        <ul className="grid grid-cols-2 gap-2">
                            {room.amenities.map((amenity, index) => (
                                <li key={index} className="flex items-center text-gray-600">
                                    <span className="mr-2">•</span> {amenity}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="flex items-center justify-between mt-8">
                        <div>
                            <span className="text-3xl font-bold text-gold">₹{room.price}</span>
                            <span className="text-gray-500"> / night</span>
                        </div>
                        <Button variant="primary" size="lg" onClick={handleBookNow}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
