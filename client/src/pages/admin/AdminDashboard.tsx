import React from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import DashboardCharts from "../../components/dashboardcharts";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-2xl font-bold">120</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Facility Owners</h2>
          <p className="text-2xl font-bold">45</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Total Bookings</h2>
          <p className="text-2xl font-bold">320</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4 text-center">
          <h2 className="text-lg font-semibold">Active Courts</h2>
          <p className="text-2xl font-bold">75</p>
        </div>
      </div>

      {/* Charts */}
      <DashboardCharts />
    </AdminLayout>
  );
}
