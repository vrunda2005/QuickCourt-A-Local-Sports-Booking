import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import DashboardCharts from "../../components/dashboardcharts";
import { getOverview, type OverviewResponse } from "../../api/admin";
import { Users, Building, CalendarCheck, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await getOverview();
        if (isMounted) setStats(data);
      } catch {
        if (isMounted)
          setStats({ totalUsers: 0, totalOwners: 0, totalBookings: 0, totalActiveCourts: 0 });
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const StatCard = ({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) => (
    <div className={`rounded-xl shadow-sm border border-gray-100 p-4 bg-gradient-to-tr from-${color}-50 to-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className="text-2xl font-bold text-gray-800">{loading ? "…" : value}</p>
        </div>
        <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" value={stats?.totalUsers ?? 0} icon={<Users className="h-5 w-5" />} color="indigo" />
        <StatCard title="Facility Owners" value={stats?.totalOwners ?? 0} icon={<Building className="h-5 w-5" />} color="green" />
        <StatCard title="Total Bookings" value={stats?.totalBookings ?? 0} icon={<CalendarCheck className="h-5 w-5" />} color="orange" />
        <StatCard title="Active Courts" value={stats?.totalActiveCourts ?? 0} icon={<Activity className="h-5 w-5" />} color="blue" />
      </div>

      {/* Charts */}
      <DashboardCharts />
    </AdminLayout>
  );
}

/*
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
*/