import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface Booking {
    _id: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
    court: {
        _id: string;
        name: string;
        sportType: string;
    };
    facility: {
        _id: string;
        name: string;
    };
    startTime: string;
    endTime: string;
    date: string;
    status: 'booked' | 'cancelled' | 'completed';
    totalAmount: number;
    createdAt: string;
}

interface Facility {
    _id: string;
    name: string;
    status: string;
}

type BookingFilter = 'all' | 'upcoming' | 'past' | 'cancelled' | 'completed';

const BookingOverview = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedFacility, setSelectedFacility] = useState<string>('');
    const [filter, setFilter] = useState<BookingFilter>('all');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { getToken } = useAuth();

    // Load facilities
    useEffect(() => {
        const loadFacilities = async () => {
            try {
                const token = await getToken();
                const res = await axios.get('http://localhost:5000/api/facilities/mine', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userFacilities = res.data.data || [];
                setFacilities(userFacilities.filter((f: Facility) => f.status === 'approved'));

                if (userFacilities.length > 0) {
                    setSelectedFacility(userFacilities[0]._id);
                }
            } catch (error) {
                console.error('Failed to load facilities:', error);
            }
        };

        loadFacilities();
    }, [getToken]);

    // Load bookings when facility changes
    useEffect(() => {
        const loadBookings = async () => {
            if (!selectedFacility) return;

            try {
                setLoading(true);
                const token = await getToken();

                // This would be your actual API call to get bookings for a facility
                // For now, we'll generate sample data
                const sampleBookings = generateSampleBookings();
                setBookings(sampleBookings);
            } catch (error) {
                console.error('Failed to load bookings:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBookings();
    }, [selectedFacility, getToken]);

    // Generate sample bookings (replace with actual API call)
    const generateSampleBookings = (): Booking[] => {
        const sampleUsers = [
            { _id: '1', name: 'John Doe', email: 'john@example.com' },
            { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
            { _id: '3', name: 'Mike Johnson', email: 'mike@example.com' },
            { _id: '4', name: 'Sarah Wilson', email: 'sarah@example.com' },
            { _id: '5', name: 'David Brown', email: 'david@example.com' },
        ];

        const sampleCourts = [
            { _id: '1', name: 'Court A', sportType: 'Badminton' },
            { _id: '2', name: 'Court B', sportType: 'Tennis' },
            { _id: '3', name: 'Court C', sportType: 'Basketball' },
        ];

        const sampleBookings: Booking[] = [];
        const now = new Date();

        // Generate past bookings (last 30 days)
        for (let i = 0; i < 15; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - Math.floor(Math.random() * 30));

            const startHour = Math.floor(Math.random() * 12) + 6; // 6 AM to 6 PM
            const duration = Math.floor(Math.random() * 3) + 1; // 1-3 hours

            const startTime = new Date(date);
            startTime.setHours(startHour, 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(startHour + duration, 0, 0, 0);

            const statuses: ('booked' | 'cancelled' | 'completed')[] = ['booked', 'cancelled', 'completed'];
            const status = statuses[Math.floor(Math.random() * statuses.length)];

            sampleBookings.push({
                _id: `past-${i}`,
                user: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
                court: sampleCourts[Math.floor(Math.random() * sampleCourts.length)],
                facility: { _id: selectedFacility, name: facilities.find(f => f._id === selectedFacility)?.name || 'Unknown' },
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                date: date.toISOString(),
                status,
                totalAmount: Math.floor(Math.random() * 500) + 200,
                createdAt: new Date(date.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        }

        // Generate upcoming bookings (next 30 days)
        for (let i = 0; i < 10; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() + Math.floor(Math.random() * 30) + 1);

            const startHour = Math.floor(Math.random() * 12) + 6;
            const duration = Math.floor(Math.random() * 3) + 1;

            const startTime = new Date(date);
            startTime.setHours(startHour, 0, 0, 0);

            const endTime = new Date(startTime);
            endTime.setHours(startHour + duration, 0, 0, 0);

            sampleBookings.push({
                _id: `upcoming-${i}`,
                user: sampleUsers[Math.floor(Math.random() * sampleUsers.length)],
                court: sampleCourts[Math.floor(Math.random() * sampleCourts.length)],
                facility: { _id: selectedFacility, name: facilities.find(f => f._id === selectedFacility)?.name || 'Unknown' },
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                date: date.toISOString(),
                status: 'booked',
                totalAmount: Math.floor(Math.random() * 500) + 200,
                createdAt: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
            });
        }

        return sampleBookings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    };

    // Filter and search bookings
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.court.sportType.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;

        const now = new Date();
        const bookingDate = new Date(booking.date);

        switch (filter) {
            case 'upcoming':
                return bookingDate > now && booking.status === 'booked';
            case 'past':
                return bookingDate < now && booking.status === 'completed';
            case 'cancelled':
                return booking.status === 'cancelled';
            case 'completed':
                return booking.status === 'completed';
            default:
                return true;
        }
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'booked': return 'bg-blue-100 text-blue-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            case 'completed': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'booked': return 'Booked';
            case 'cancelled': return 'Cancelled';
            case 'completed': return 'Completed';
            default: return 'Unknown';
        }
    };

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getFilterCount = (filterType: BookingFilter) => {
        const now = new Date();
        return bookings.filter(booking => {
            const bookingDate = new Date(booking.date);
            switch (filterType) {
                case 'upcoming':
                    return bookingDate > now && booking.status === 'booked';
                case 'past':
                    return bookingDate < now && booking.status === 'completed';
                case 'cancelled':
                    return booking.status === 'cancelled';
                case 'completed':
                    return booking.status === 'completed';
                default:
                    return true;
            }
        }).length;
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Booking Overview</h1>

            {/* Selection Controls */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Facility</label>
                        <select
                            value={selectedFacility}
                            onChange={(e) => setSelectedFacility(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Choose a facility</option>
                            {facilities.map(facility => (
                                <option key={facility._id} value={facility._id}>
                                    {facility.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                        <input
                            type="text"
                            placeholder="Search by user name, court, or sport..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        All ({getFilterCount('all')})
                    </button>
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'upcoming'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Upcoming ({getFilterCount('upcoming')})
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'past'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Past ({getFilterCount('past')})
                    </button>
                    <button
                        onClick={() => setFilter('completed')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Completed ({getFilterCount('completed')})
                    </button>
                    <button
                        onClick={() => setFilter('cancelled')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'cancelled'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Cancelled ({getFilterCount('cancelled')})
                    </button>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="text-gray-500">Loading bookings...</div>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-8 text-center">
                        <div className="text-gray-500">No bookings found matching your criteria.</div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Details
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Court & Sport
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date & Time
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Duration
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{booking.user.name}</div>
                                                <div className="text-sm text-gray-500">{booking.user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{booking.court.name}</div>
                                                <div className="text-sm text-gray-500">{booking.court.sportType}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(booking.date).toLocaleDateString()}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {Math.round((new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime()) / (1000 * 60 * 60))} hours
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ₹{booking.totalAmount}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                {getStatusText(booking.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                                                View
                                            </button>
                                            {booking.status === 'booked' && (
                                                <button className="text-red-600 hover:text-red-900">
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <div className="text-2xl font-bold text-blue-600">{getFilterCount('upcoming')}</div>
                    <div className="text-sm text-gray-600">Upcoming Bookings</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <div className="text-2xl font-bold text-green-600">{getFilterCount('completed')}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <div className="text-2xl font-bold text-red-600">{getFilterCount('cancelled')}</div>
                    <div className="text-sm text-gray-600">Cancelled</div>
                </div>
                <div className="bg-white p-4 rounded-lg shadow text-center">
                    <div className="text-2xl font-bold text-purple-600">
                        ₹{filteredBookings.reduce((sum, b) => sum + b.totalAmount, 0)}
                    </div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
            </div>
        </div>
    );
};

export default BookingOverview;
