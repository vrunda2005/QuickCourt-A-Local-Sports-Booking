import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserButton, useUser } from '@clerk/clerk-react';

const AdminNavbar: React.FC = () => {
    const { user } = useUser();
    const location = useLocation();

    const isActive = (path: string) => location.pathname.startsWith(path);

    return (
        <nav className="bg-white shadow-lg border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/admin/dashboard" className="text-2xl font-bold text-red-600">
                            QuickCourt Admin
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/admin/dashboard"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/dashboard') && location.pathname === '/admin/dashboard'
                                    ? 'text-red-600 bg-red-50'
                                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                                }`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin/facilities"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/facilities')
                                    ? 'text-red-600 bg-red-50'
                                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                                }`}
                        >
                            Facility Approval
                        </Link>
                        <Link
                            to="/admin/users"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/users')
                                    ? 'text-red-600 bg-red-50'
                                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                                }`}
                        >
                            User Management
                        </Link>
                        <Link
                            to="/admin/reports"
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin/reports')
                                    ? 'text-red-600 bg-red-50'
                                    : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                                }`}
                        >
                            Reports
                        </Link>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <span className="hidden sm:block text-sm text-gray-700">
                            Admin: {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || 'Administrator'}
                        </span>
                        <UserButton afterSignOutUrl="/" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
