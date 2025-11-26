import React, { useState } from 'react';
import { AdminRooms } from '../components/AdminRooms';
import { AdminBanquet } from '../components/AdminBanquet';
import { AdminRestaurant } from '../components/AdminRestaurant';
import { AdminBookings } from '../components/AdminBookings';
import { AdminUsers } from '../components/AdminUsers';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'rooms':
        return <AdminRooms />;
      case 'banquet':
        return <AdminBanquet />;
      case 'restaurant':
        return <AdminRestaurant />;
      case 'bookings':
        return <AdminBookings />;
      case 'users':
        return <AdminUsers />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-playfair text-gold mb-8 text-center">Admin Dashboard</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gold/20">
            <nav className="flex flex-col">
              {[
                { id: 'dashboard', label: 'Overview', icon: '📊' },
                { id: 'rooms', label: 'Rooms', icon: '🛏️' },
                { id: 'banquet', label: 'Banquet Halls', icon: '✨' },
                { id: 'restaurant', label: 'Restaurant', icon: '🍽️' },
                { id: 'bookings', label: 'Bookings', icon: '📅' },
                { id: 'users', label: 'Users', icon: '👥' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center px-6 py-4 text-left transition-colors ${activeTab === item.id
                      ? 'bg-gold text-white'
                      : 'text-gray-700 hover:bg-cream'
                    }`}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-grow">
          <div className="bg-white shadow-lg rounded-lg p-6 border border-gold/20 min-h-[500px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardOverview = ({ setActiveTab }) => (
  <div>
    <h2 className="text-2xl font-playfair text-gold mb-6">Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        { label: 'Total Users', value: 'Loading...', icon: '👥', color: 'blue' },
        { label: 'Active Bookings', value: 'Loading...', icon: '📅', color: 'green' },
        { label: 'Revenue (Today)', value: 'Loading...', icon: '💰', color: 'yellow' },
        { label: 'Occupancy Rate', value: 'Loading...', icon: '📊', color: 'purple' },
      ].map((stat, index) => (
        <div key={index} className="bg-white border border-gray-200 p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600`}>
              {stat.icon}
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
          <h3 className="text-2xl font-bold text-gray-800">{stat.value}</h3>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-cream/30 p-6 rounded-lg border border-gold/10">
        <h3 className="text-xl font-playfair text-gold mb-4">Quick Actions</h3>
        <div className="space-y-3">
          <button onClick={() => setActiveTab('rooms')} className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow flex items-center">
            <span className="mr-3">➕</span> Add New Room
          </button>
          <button onClick={() => setActiveTab('bookings')} className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow flex items-center">
            <span className="mr-3">👁️</span> View Recent Bookings
          </button>
          <button onClick={() => setActiveTab('users')} className="w-full text-left p-3 bg-white rounded shadow-sm hover:shadow-md transition-shadow flex items-center">
            <span className="mr-3">👤</span> Manage Users
          </button>
        </div>
      </div>

      <div className="bg-cream/30 p-6 rounded-lg border border-gold/10">
        <h3 className="text-xl font-playfair text-gold mb-4">System Status</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Server Status</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">ONLINE</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Database</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">CONNECTED</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Last Backup</span>
            <span className="text-sm text-gray-500">Today, 04:00 AM</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
