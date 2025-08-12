import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import { Users, Building, CalendarCheck, Activity } from "lucide-react";
import { getOverview } from "../../api/admin";
import DashboardCharts from "../../components/dashboardcharts";

type OverviewResponse = {
  totalUsers: number;
  totalFacilities: number;
  totalBookings: number;
  pendingFacilities: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<OverviewResponse>({
    totalUsers: 0,
    totalFacilities: 0,
    totalBookings: 0,
    pendingFacilities: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchOverview() {
    try {
      // simulate network delay
      await new Promise(res => setTimeout(res, 500));

      // fake data:
      const data = {
        totalUsers: 51,
        totalFacilities: 12,
        totalBookings: 35,
        pendingFacilities: 3,
      };
      setStats(data);
    } catch (error) {
      console.error("Error fetching overview:", error);
    } finally {
      setLoading(false);
    }
  }
  fetchOverview();
}, []);


  const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) => (
  <div
    className={`rounded-xl shadow-sm border border-gray-100 p-4 bg-white`}
  >
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <p className="text-2xl font-bold text-gray-900">
          {loading ? "…" : value}
        </p>
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
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Users className="h-5 w-5" />}
          color="indigo"
        />
        <StatCard
          title="Facilities"
          value={stats.totalFacilities}
          icon={<Building className="h-5 w-5" />}
          color="green"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<CalendarCheck className="h-5 w-5" />}
          color="orange"
        />
        <StatCard
          title="Pending Facilities"
          value={stats.pendingFacilities}
          icon={<Activity className="h-5 w-5" />}
          color="blue"
        />
      </div>
      <DashboardCharts/>
      {/* You can add your charts here */}
    </AdminLayout>
  );

}
