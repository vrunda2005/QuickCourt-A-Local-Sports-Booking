import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

type Facility = {
    name: string;
    location: string;
};

type Booking = {
    _id: string;
    facility: Facility | string;
    date: string;
    timeSlot: string;
};

const API_BASE = 'http://localhost:5000/api';

const MyBookings: React.FC = () => {
    const { getToken } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = await getToken();
            if (!token) {
                setError('Authentication token not found. Please sign in.');
                return;
            }
            const res = await axios.get(`${API_BASE}/bookings/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBookings(res.data.data || []);
        } catch (error: any) {
            setError('Failed to load bookings. Please try again later.');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const cancel = async (id: string) => {
        try {
            const token = await getToken();
            if (!token) {
                setError('Authentication token not found. Please sign in.');
                return;
            }
            await axios.delete(`${API_BASE}/bookings/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await load();
        } catch (error: any) {
            setError('Failed to cancel booking. Please try again.');
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
            {loading ? (
                <p className="text-gray-500">Loading bookings...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : bookings.length === 0 ? (
                <p className="text-gray-500">No bookings found.</p>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b._id} className="border border-gray-200 p-4 rounded-lg shadow-sm">
                            <div className="font-semibold">
                                {typeof b.facility === 'object' && b.facility !== null && 'name' in b.facility
                                    ? `${(b.facility as Facility).name} - ${(b.facility as Facility).location}`
                                    : typeof b.facility === 'string' ? b.facility : 'Unknown Facility'}
                            </div>
                            <div className="text-gray-600">{b.date} | {b.timeSlot}</div>
                            <button onClick={() => cancel(b._id)} className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Cancel</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;



