import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import DashboardCharts from "../../components/dashboardcharts";
import { getOverview, type OverviewResponse } from "../../api/admin";

export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getOverview();
        if (isMounted) setStats(data);
      } catch (e) {
        if (isMounted) setStats({ totalUsers: 0, totalOwners: 0, totalBookings: 0, totalActiveCourts: 0 });
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false };
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl font-bold">{stats?.totalUsers ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-lg font-semibold">Facility Owners</h2>
            <p className="text-2xl font-bold">{stats?.totalOwners ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-lg font-semibold">Total Bookings</h2>
            <p className="text-2xl font-bold">{stats?.totalBookings ?? 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-lg font-semibold">Active Courts</h2>
            <p className="text-2xl font-bold">{stats?.totalActiveCourts ?? 0}</p>
          </div>
        </div>
      )}

      <DashboardCharts />
    </AdminLayout>
  );
}
