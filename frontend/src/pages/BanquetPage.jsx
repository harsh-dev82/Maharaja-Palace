import React from 'react';
import { Card } from '../components/BaseComponents';
import { banquetAPI } from '../api/api';

export const BanquetPage = () => {
  const [halls, setHalls] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchHalls = async () => {
      try {
        const response = await banquetAPI.getAllHalls();
        setHalls(response.data.banquetHalls);
      } catch (error) {
        console.error('Failed to fetch halls', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHalls();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-playfair text-gold mb-8 text-center">
        Banquet & Events
      </h1>
      <p className="text-lg text-lightText text-center mb-12 max-w-2xl mx-auto">
        Host your special moments in our magnificent banquet halls with world-class facilities
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {halls.map((hall) => (
          <Card key={hall._id}>
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-2xl font-playfair text-gold mb-2">{hall.name}</h3>
            <p className="text-gold font-semibold mb-2">Capacity: {hall.capacity}</p>
            <p className="text-lightText mb-4">{hall.description}</p>
            <p className="text-lg font-semibold text-gold mb-4">Price: ₹{hall.basePrice}</p>
            <button
              onClick={() => window.location.href = `/booking?type=banquet&hallId=${hall._id}`}
              className="w-full bg-gold text-white py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Book Now
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
