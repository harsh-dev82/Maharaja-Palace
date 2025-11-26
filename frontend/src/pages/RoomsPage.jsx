import React from 'react';
import { Card } from '../components/BaseComponents';
import { roomAPI } from '../api/api';

export const RoomsPage = () => {
  const [rooms, setRooms] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomAPI.getAllRooms();
        setRooms(response.data.rooms);
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-playfair text-gold mb-8 text-center">
        Our Luxurious Rooms
      </h1>
      <p className="text-lg text-lightText text-center mb-12 max-w-2xl mx-auto">
        Discover our collection of elegantly designed rooms, from intimate single suites to sprawling royal penthouses.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <Card key={room._id} hoverable className="cursor-pointer group">
            <div onClick={() => window.location.href = `/rooms/${room._id}`} className="block">
              <div className="text-5xl mb-4 text-center group-hover:scale-110 transition-transform duration-300">
                {room.images && room.images.length > 0 ? (
                  <img src={room.images[0].url} alt={room.roomNumber} className="w-full h-48 object-cover rounded" />
                ) : (
                  '🛏️'
                )}
              </div>
              <h3 className="text-2xl font-playfair text-gold mb-2">{room.roomType.name} - {room.roomNumber}</h3>
              <p className="text-lightText mb-4">{room.roomType.description}</p>
              <p className="text-xl font-semibold text-gold mb-4">₹{room.currentPrice}/night</p>
              <button className="w-full bg-gold text-white py-2 rounded hover:bg-opacity-90 transition-colors">
                View Details
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
