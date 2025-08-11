import React from 'react';
import { useRole } from '../../context/RoleContext';
import UserNavbar from './UserNavbar';
import FacilityOwnerNavbar from './FacilityOwnerNavbar';
import AdminNavbar from './AdminNavbar';

const Navbar: React.FC = () => {
  const { role, loading } = useRole();

  // Show loading state while determining role
  if (loading) {
    return (
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-gray-400">QuickCourt</div>
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full"></div>
          </div>
        </div>
      </nav>
    );
  }

  // Render role-specific navbar
  if (role === 'Admin') {
    return <AdminNavbar />;
  }

  if (role === 'FacilityOwner') {
    return <FacilityOwnerNavbar />;
  }

  if (role === 'User') {
    return <UserNavbar />;
  }

  // Default navbar for unauthenticated users
  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-2xl font-bold text-blue-600">QuickCourt</div>
          <div className="flex items-center space-x-4">
            <a href="/sign-in" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">
              Sign In
            </a>
            <a href="/sign-up" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



