import { Routes, Route, Link } from 'react-router-dom';
import { HomeIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import OwnerDashboardHome from './Analytics';
import FacilityManagement from './FacilityManagement';
import CourtManagement from './CourtManagement';

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
                    const approvedFacility = userFacilities.find(f => f.status === 'approved');
                    setSelectedFacilityId(approvedFacility?._id || userFacilities[0]._id);
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
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-64 bg-gray-800 text-white p-4">
                    <h2 className="text-xl font-bold mb-6">Facility Owner Dashboard</h2>
                </div>
                <div className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome, {user?.firstName || 'Facility Owner'}!</h1>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <p className="text-gray-600 mb-4">You don't have any facilities yet. Create your first facility to get started!</p>
                        <Link 
                            to="/owner/dashboard/facility" 
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Create First Facility
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-6">Facility Owner Dashboard</h2>
                
                {/* Facility Selector */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">Select Facility</label>
                    <select
                        value={selectedFacilityId}
                        onChange={(e) => setSelectedFacilityId(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                    >
                        {facilities.map(facility => (
                            <option key={facility._id} value={facility._id}>
                                {facility.name} ({facility.status})
                            </option>
                        ))}
                    </select>
                </div>

                <nav>
                    <ul>
                        <li className="mb-4">
                            <Link to="/owner/dashboard" className="flex items-center hover:text-blue-300">
                                <HomeIcon className="h-5 w-5 mr-2" /> Dashboard
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link to="/owner/dashboard/facility" className="flex items-center hover:text-blue-300">
                                <BuildingOfficeIcon className="h-5 w-5 mr-2" /> Facility Management
                            </Link>
                        </li>
                        <li className="mb-4">
                            <Link to="/owner/dashboard/courts" className="flex items-center hover:text-blue-300">
                                <CalendarIcon className="h-5 w-5 mr-2" /> Court Management
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Welcome, {user?.firstName || 'Facility Owner'}!</h1>
                <Routes>
                    <Route index element={<OwnerDashboardHome />} />
                    <Route path="facility" element={<FacilityManagement />} />
                    <Route path="courts" element={<CourtManagement facilityId={selectedFacilityId} />} />
                </Routes>
            </div>
        </div>
    );
};

export default OwnerDashboard;


