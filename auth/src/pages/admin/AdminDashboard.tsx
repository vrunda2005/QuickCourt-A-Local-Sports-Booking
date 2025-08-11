import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface Facility {
  _id: string;
  name: string;
  location: string;
  description?: string;
  imageUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, totalFacilities: 0, totalBookings: 0 });
  const { getToken } = useAuth();

  const loadPendingFacilities = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('http://localhost:5000/api/facilities/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFacilities(res.data.data || []);
    } catch (error) {
      console.error('Failed to load pending facilities:', error);
    }
  };

  const loadStats = async () => {
    try {
      const token = await getToken();
      const res = await axios.get('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([loadPendingFacilities(), loadStats()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleApproval = async (facilityId: string, status: 'approved' | 'rejected') => {
    try {
      const token = await getToken();
      await axios.put(`http://localhost:5000/api/facilities/${facilityId}/approve`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove the facility from the pending list
      setFacilities(prev => prev.filter(f => f._id !== facilityId));
      
      // Reload stats
      await loadStats();
    } catch (error) {
      console.error(`Failed to ${status} facility:`, error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Facilities</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalFacilities}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
        </div>
      </div>

      {/* Pending Facilities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Pending Facility Approvals</h2>
          <p className="text-gray-600">Review and approve new facility submissions</p>
        </div>
        
        {facilities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No pending facilities to review
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {facilities.map((facility) => (
              <div key={facility._id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold">{facility.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                        Pending
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">{facility.location}</p>
                    {facility.description && (
                      <p className="text-gray-700 mt-2">{facility.description}</p>
                    )}
                    <div className="mt-3 text-sm text-gray-500">
                      <p>Owner: {facility.owner.name} ({facility.owner.email})</p>
                      <p>Submitted: {new Date(facility.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleApproval(facility._id, 'approved')}
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleApproval(facility._id, 'rejected')}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
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
    </div>
  );
};

export default AdminDashboard;
