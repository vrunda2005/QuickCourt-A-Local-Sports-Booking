// src/pages/admin/AdminProfile.tsx
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import {
  getAdminProfile,
  getAdminStats,
  getAdminRecentActions
} from "../../api/admin";
import { useNavigate } from "react-router-dom";

type AdminInfo = {
  fullName: string;
  email: string;
  role: string;
  joinedAt: string;
};

type AdminStats = {
  totalUsers: number;
  totalFacilities: number;
  pendingReports: number;
};

type AdminAction = {
  _id: string;
  action: string;
  target: string;
  date: string;
};

export default function AdminProfile() {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActions, setRecentActions] = useState<AdminAction[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, statsRes, actionsRes] = await Promise.all([
        getAdminProfile(),
        getAdminStats(),
        getAdminRecentActions()
      ]);
      setAdmin(profileRes || null);
      setStats(statsRes || null);
      setRecentActions(Array.isArray(actionsRes) ? actionsRes : []);
    } catch (e) {
      console.error("Error loading admin profile:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Admin Profile</h1>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Profile Info */}
          {admin && (
            <div className="bg-white rounded-lg shadow p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2">Profile Information</h2>
              <p><strong>Name:</strong> {admin.fullName}</p>
              <p><strong>Email:</strong> {admin.email}</p>
              <p className="capitalize"><strong>Role:</strong> {admin.role}</p>
              <p><strong>Joined:</strong> {new Date(admin.joinedAt).toLocaleDateString()}</p>
            </div>
          )}

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
                <p>Total Users</p>
              </div>
              <div className="bg-green-100 p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold">{stats.totalFacilities}</p>
                <p>Total Facilities</p>
              </div>
              <div className="bg-yellow-100 p-4 rounded-lg shadow text-center">
                <p className="text-2xl font-bold">{stats.pendingReports}</p>
                <p>Pending Reports</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={() => navigate("/admin/facility-approval")}
            >
              Approve Facilities
            </button>
            <button
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              onClick={() => navigate("/admin/reports")}
            >
              Review Reports
            </button>
          </div>

          {/* Recent Actions */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-2">Recent Actions</h2>
            {recentActions.length === 0 ? (
              <p className="text-gray-500">No recent actions found.</p>
            ) : (
              <ul className="divide-y">
                {recentActions.map((a) => (
                  <li key={a._id} className="py-2 flex justify-between">
                    <span>{a.action} — <strong>{a.target}</strong></span>
                    <span className="text-gray-500 text-sm">
                      {new Date(a.date).toLocaleString("en-IN")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
