import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

const FacilityOwnerNavbar: React.FC = () => {
  const { user } = useUser();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/owner/dashboard" className="text-2xl font-bold text-green-600">
              QuickCourt Owner
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/owner/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/owner/dashboard') && location.pathname === '/owner/dashboard'
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
            >
              Dashboard
            </Link>
            <Link
              to="/owner/dashboard/facilities"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/owner/dashboard/facilities')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
            >
              Facilities
            </Link>
            <Link
              to="/owner/dashboard/courts"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/owner/dashboard/courts')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
            >
              Courts
            </Link>
            <Link
              to="/owner/dashboard/timeslots"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/owner/dashboard/timeslots')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
            >
              Time Slots
            </Link>
            <Link
              to="/owner/dashboard/bookings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/owner/dashboard/bookings')
                  ? 'text-green-600 bg-green-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
            >
              Bookings
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="hidden sm:block text-sm text-gray-700">
              Facility Owner: {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'Facility Owner'}
            </span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FacilityOwnerNavbar;
