import React from 'react';
import { Card } from '../components/BaseComponents';
import { restaurantAPI } from '../api/api';

export const RestaurantPage = () => {
  const [tables, setTables] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await restaurantAPI.getAllTables();
        setTables(response.data.tables);
      } catch (error) {
        console.error('Failed to fetch tables', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  if (loading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-5xl font-playfair text-gold mb-8 text-center">
        Dining Experience
      </h1>
      <p className="text-lg text-lightText text-center mb-12 max-w-2xl mx-auto">
        Indulge in world-class cuisine at our award-winning restaurants
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {tables.map((table) => (
          <Card key={table._id}>
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-2xl font-playfair text-gold mb-2">Table {table.tableNumber}</h3>
            <p className="text-gold font-semibold mb-2">Capacity: {table.capacity}</p>
            <p className="text-lightText mb-4">{table.description}</p>
            <p className="text-sm text-gray-500 mb-4">Location: {table.location}</p>
            <button
              onClick={() => window.location.href = `/booking?type=restaurant&tableId=${table._id}`}
              className="w-full bg-gold text-white py-2 rounded hover:bg-opacity-90 transition-colors"
            >
              Book Table
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
