import { Routes, Route, Link } from 'react-router-dom';
import { HomeIcon, BuildingOfficeIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { useUser } from '@clerk/clerk-react';
import OwnerDashboardHome from './Analytics';
import FacilityManagement from './FacilityManagement';
import CourtManagement from './CourtManagement';

const OwnerDashboard = () => {
    const { user } = useUser();

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="w-64 bg-gray-800 text-white p-4">
                <h2 className="text-xl font-bold mb-6">Facility Owner Dashboard</h2>
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
                    <Route path="courts" element={<CourtManagement />} />
                </Routes>
            </div>
        </div>
    );
};

export default OwnerDashboard;


