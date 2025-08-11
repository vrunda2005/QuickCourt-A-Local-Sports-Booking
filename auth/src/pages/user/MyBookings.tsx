import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

interface Booking {
    _id: string;
    facility: {
        _id: string;
        name: string;
        location: string;
        imageUrl?: string;
    };
    court: string;
    date: string;
    startTime: string;
    endTime: string;
    totalAmount: number;
    status: 'booked' | 'cancelled' | 'completed';
    createdAt: string;
}

const MyBookings = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { getToken } = useAuth();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                const response = await axios.get('http://localhost:5000/api/bookings/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (response.data.success) {
                    setBookings(response.data.data);
                } else {
                    setError('Failed to fetch bookings');
                }
            } catch (err) {
                console.error('Error fetching bookings:', err);
                setError('Failed to load your bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [getToken]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'booked': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'booked': return 'Confirmed';
            case 'cancelled': return 'Cancelled';
            case 'completed': return 'Completed';
            default: return 'Unknown';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const calculateDuration = (startTime: string, endTime: string) => {
        const start = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);
        const diffMs = end.getTime() - start.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        return diffHours;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Bookings</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
                <p className="text-gray-600">Manage and view all your court bookings</p>
            </div>

            {bookings.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-6xl mb-4">🏸</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">No Bookings Yet</h2>
                    <p className="text-gray-600 mb-6">Start by booking your first court!</p>
                    <a
                        href="/venues"
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Browse Venues
                    </a>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {bookings.map((booking) => (
                        <div
                            key={booking._id}
                            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {/* Venue Image */}
                            <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                                {booking.facility.imageUrl ? (
                                    <img
                                        src={booking.facility.imageUrl}
                                        alt={booking.facility.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-white text-4xl">🏟️</div>
                                )}
                            </div>

                            {/* Booking Details */}
                            <div className="p-6">
                                {/* Venue Info */}
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        {booking.facility.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        📍 {booking.facility.location}
                                    </p>
                                    <p className="text-sm text-gray-700 font-medium">
                                        🏸 Court: {booking.court}
                                    </p>
                                </div>

                                {/* Date & Time */}
                                <div className="mb-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-5">📅</span>
                                        <span>{formatDate(booking.date)}</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-5">⏰</span>
                                        <span>
                                            {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-600">
                                        <span className="w-5">⏱️</span>
                                        <span>{calculateDuration(booking.startTime, booking.endTime)} hours</span>
                                    </div>
                                </div>

                                {/* Price & Status */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-bold text-blue-600">
                                        ₹{booking.totalAmount}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                                        {getStatusText(booking.status)}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex space-x-2">
                                    {booking.status === 'booked' && (
                                        <button className="flex-1 bg-red-500 text-white py-2 px-4 rounded text-sm font-medium hover:bg-red-600 transition-colors">
                                            Cancel Booking
                                        </button>
                                    )}
                                    <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded text-sm font-medium hover:bg-gray-200 transition-colors">
                                        View Details
                                    </button>
                                </div>

                                {/* Booking Date */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500">
                                        Booked on {new Date(booking.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            {bookings.length > 0 && (
                <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
                        <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {bookings.filter(b => b.status === 'booked').length}
                        </div>
                        <div className="text-sm text-gray-600">Confirmed</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-orange-600">
                            {bookings.filter(b => b.status === 'completed').length}
                        </div>
                        <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            ₹{bookings.reduce((sum, b) => sum + b.totalAmount, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total Spent</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;



