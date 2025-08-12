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

type AdminAction = {
  _id: string;
  action: string;
  target: string;
  date: string;
};

export default function AdminProfile() {
  const [admin, setAdmin] = useState<AdminInfo | null>({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    role: "admin",
    joinedAt: new Date("2023-01-15").toISOString(),
  });
  const [recentActions, setRecentActions] = useState<AdminAction[]>([
    {
      _id: "a1",
      action: "Approved facility",
      target: "Community Sports Complex",
      date: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), // 2 hours ago
    },
    {
      _id: "a2",
      action: "Banned user",
      target: "user123",
      date: new Date(Date.now() - 3600 * 1000 * 5).toISOString(), // 5 hours ago
    },
    {
      _id: "a3",
      action: "Reviewed report",
      target: "Report #456",
      date: new Date(Date.now() - 3600 * 1000 * 24).toISOString(), // 1 day ago
    },
  ]);
  const [loading, setLoading] = useState(false); // changed to false so fake data shows immediately
  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, , actionsRes] = await Promise.all([
        getAdminProfile(),
        getAdminStats(), // ignoring stats now since we removed that section
        getAdminRecentActions()
      ]);
      setAdmin(profileRes || admin);
      setRecentActions(Array.isArray(actionsRes) ? actionsRes : recentActions);
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
              <p><strong>Name: Ura Modi</strong> {admin.fullName}</p>
              <p><strong>Email: ura.99@yahoo.com</strong> {admin.email}</p>
              <p className="capitalize"><strong>Role: Admin</strong> {admin.role}</p>
             
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
