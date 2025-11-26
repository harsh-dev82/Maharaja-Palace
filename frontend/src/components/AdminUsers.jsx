import React, { useState, useEffect } from 'react';
import { authAPI } from '../api/api';
import { Card } from '../components/BaseComponents';

export const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await authAPI.getAllUsers();
            setUsers(response.data.users);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2 className="text-2xl font-playfair text-gold mb-6">Manage Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map(user => (
                    <Card key={user._id}>
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gold text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
                                {user.firstName[0]}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{user.firstName} {user.lastName}</h3>
                                <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <div className="border-t pt-4">
                            <p className="text-sm"><span className="font-semibold">Role:</span> {user.role}</p>
                            <p className="text-sm"><span className="font-semibold">Phone:</span> {user.phone}</p>
                            <p className="text-sm"><span className="font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
