import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { HomeIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import CourtManagement from './CourtManagement';
import FacilityManagement from './FacilityManagement';
import Analytics from './Analytics';
import TimeSlotManagement from './TimeSlotManagement';
import BookingOverview from './BookingOverview';

interface Facility {
    _id: string;
    name: string;
    location: string;
    status: string;
}

const OwnerDashboard = () => {
    const { user } = useUser();
    const { getToken } = useAuth();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        const loadFacilities = async () => {
            try {
                const token = await getToken();
                const res = await axios.get('http://localhost:5000/api/facilities/mine', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const userFacilities = res.data.data || [];
                setFacilities(userFacilities);

                // Select the first facility by default, or the first approved one
                if (userFacilities.length > 0) {
                    setSelectedFacilityId(userFacilities[0]._id);
                }
            } catch (error) {
                console.error('Failed to load facilities:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadFacilities();
        }
    }, [user, getToken]);

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (facilities.length === 0) {
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Owner Dashboard</h1>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                    <h2 className="text-lg font-semibold text-yellow-800 mb-2">No Facilities Found</h2>
                    <p className="text-yellow-700 mb-4">
                        You haven't created any facilities yet. Create your first facility to get started!
                    </p>
                    <Link
                        to="/owner/dashboard/facilities"
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
                    >
                        Create Your First Facility
                    </Link>
                </div>
            </div>
        );
    }

    const isActiveRoute = (path: string) => {
        return location.pathname === `/owner/dashboard${path}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Owner Dashboard</h1>

                    {/* Facility Selector */}
                    <div className="bg-white rounded-lg shadow mb-6 p-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Facility to Manage
                        </label>
                        <select
                            value={selectedFacilityId}
                            onChange={(e) => setSelectedFacilityId(e.target.value)}
                            className="w-full max-w-xs p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {facilities.map((facility: Facility) => (
                                <option key={facility._id} value={facility._id}>
                                    {facility.name} ({facility.status})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <nav className="flex space-x-8 px-6" aria-label="Tabs">
                            <Link
                                to="/owner/dashboard"
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${isActiveRoute('') || isActiveRoute('/analytics')
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Analytics
                            </Link>
                            <Link
                                to="/owner/dashboard/facilities"
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${isActiveRoute('/facilities')
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Facility Management
                            </Link>
                            <Link
                                to="/owner/dashboard/courts"
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${isActiveRoute('/courts')
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Court Management
                            </Link>
                            <Link
                                to="/owner/dashboard/timeslots"
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${isActiveRoute('/timeslots')
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Time Slots
                            </Link>
                            <Link
                                to="/owner/dashboard/bookings"
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${isActiveRoute('/bookings')
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                Bookings
                            </Link>
                        </nav>
                    </div>

                    {/* Content Area */}
                    <div className="bg-white rounded-lg shadow">
                        <Routes>
                            <Route path="/" element={<Analytics />} />
                            <Route path="/analytics" element={<Analytics />} />
                            <Route path="/facilities" element={<FacilityManagement />} />
                            <Route path="/courts" element={<CourtManagement facilityId={selectedFacilityId} />} />
                            <Route path="/timeslots" element={<TimeSlotManagement />} />
                            <Route path="/bookings" element={<BookingOverview />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OwnerDashboard;


