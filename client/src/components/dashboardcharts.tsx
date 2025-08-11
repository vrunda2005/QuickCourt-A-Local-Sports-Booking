import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const colors = ["#4F46E5", "#16A34A", "#F59E0B", "#EF4444"];

export default function DashboardCharts() {
  // Dummy data — replace with API results
  const bookingActivity = [
    { month: "Jan", bookings: 30 },
    { month: "Feb", bookings: 45 },
    { month: "Mar", bookings: 28 },
    { month: "Apr", bookings: 60 }
  ];

  const registrationTrends = [
    { month: "Jan", users: 20 },
    { month: "Feb", users: 25 },
    { month: "Mar", users: 40 },
    { month: "Apr", users: 50 }
  ];

  const facilityApprovalTrend = [
    { month: "Jan", approved: 5, rejected: 2 },
    { month: "Feb", approved: 8, rejected: 1 },
    { month: "Mar", approved: 4, rejected: 3 },
    { month: "Apr", approved: 10, rejected: 0 }
  ];

  const mostActiveSports = [
    { name: "Football", value: 400 },
    { name: "Tennis", value: 300 },
    { name: "Badminton", value: 300 },
    { name: "Basketball", value: 200 }
  ];

  const earningsSimulation = [
    { month: "Jan", earnings: 1200 },
    { month: "Feb", earnings: 1800 },
    { month: "Mar", earnings: 900 },
    { month: "Apr", earnings: 2000 }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Booking Activity */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Booking Activity Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={bookingActivity}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" stroke="#4F46E5" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Registration Trends */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">User Registration Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={registrationTrends}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#16A34A" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Facility Approval Trend */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Facility Approval Trend</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={facilityApprovalTrend}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="approved" fill="#4F46E5" />
            <Bar dataKey="rejected" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Most Active Sports */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Most Active Sports</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={mostActiveSports}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {mostActiveSports.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Earnings Simulation */}
      <div className="bg-white rounded-lg shadow p-4 col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Earnings Simulation</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={earningsSimulation}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="earnings" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
