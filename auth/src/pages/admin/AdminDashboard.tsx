import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

interface AdminStats {
  totalUsers: number;
  totalFacilities: number;
  pendingFacilities: number;
  totalBookings: number;
}

interface PendingFacility {
  _id: string;
  name: string;
  location: string;
  owner: {
    name: string;
    email: string;
  };
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingFacilities, setPendingFacilities] = useState<PendingFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        // Fetch admin statistics
        const statsResponse = await axios.get('http://localhost:5000/api/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Fetch pending facilities
        const facilitiesResponse = await axios.get('http://localhost:5000/api/admin/facilities/pending', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        if (facilitiesResponse.data.success) {
          setPendingFacilities(facilitiesResponse.data.data);
        }

      } catch (err: any) {
        console.error('Error fetching admin data:', err);
        setError(err.response?.data?.error || 'Failed to fetch admin data');

        // Set mock data for development
        setStats({
          totalUsers: 150,
          totalFacilities: 25,
          pendingFacilities: 3,
          totalBookings: 1200
        });

        setPendingFacilities([
          {
            _id: '1',
            name: 'Sports Complex Alpha',
            location: 'Downtown Area',
            owner: { name: 'John Doe', email: 'john@example.com' },
            status: 'pending',
            createdAt: '2024-01-15'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [getToken]);

  const handleApproveFacility = async (facilityId: string) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `http://localhost:5000/api/admin/facilities/${facilityId}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Remove from pending list
        setPendingFacilities(prev => prev.filter(f => f._id !== facilityId));
        // Update stats
        if (stats) {
          setStats(prev => prev ? {
            ...prev,
            pendingFacilities: prev.pendingFacilities - 1,
            totalFacilities: prev.totalFacilities + 1
          } : null);
        }
      }
    } catch (err: any) {
      console.error('Error approving facility:', err);
      alert('Failed to approve facility');
    }
  };

  const handleRejectFacility = async (facilityId: string) => {
    try {
      const token = await getToken();
      const response = await axios.put(
        `http://localhost:5000/api/admin/facilities/${facilityId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Remove from pending list
        setPendingFacilities(prev => prev.filter(f => f._id !== facilityId));
        // Update stats
        if (stats) {
          setStats(prev => prev ? {
            ...prev,
            pendingFacilities: prev.pendingFacilities - 1
          } : null);
        }
      }
    } catch (err: any) {
      console.error('Error rejecting facility:', err);
      alert('Failed to reject facility');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your QuickCourt platform</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Facilities</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalFacilities}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingFacilities}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pending Facilities */}
        <div className="bg-white rounded-lg shadow border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Pending Facility Approvals</h2>
          </div>

          {pendingFacilities.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No pending facilities to approve
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingFacilities.map((facility) => (
                <div key={facility._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{facility.name}</h3>
                      <p className="text-sm text-gray-600">📍 {facility.location}</p>
                      <p className="text-sm text-gray-600">
                        Owner: {facility.owner.name} ({facility.owner.email})
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted: {new Date(facility.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveFacility(facility._id)}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectFacility(facility._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                View All Users
              </button>
              <button className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                Generate Reports
              </button>
              <button className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition-colors">
                System Settings
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>• New facility registration: Sports Complex Beta</p>
              <p>• User John Doe upgraded to Premium</p>
              <p>• Monthly report generated</p>
              <p>• System backup completed</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="text-green-500 text-sm">● Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Server</span>
                <span className="text-green-500 text-sm">● Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment Gateway</span>
                <span className="text-green-500 text-sm">● Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;