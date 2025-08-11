import React, { useEffect, useState } from "react";
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
import { getBookingsActivity, getUserRegistrations, getApprovalTrend, getActiveSports, getEarningsSimulation } from "../api/admin";

const colors = ["#4F46E5", "#16A34A", "#F59E0B", "#EF4444"] as const;

type ApprovalPoint = { date: string; approved: number; rejected: number };

export default function DashboardCharts() {
  const [bookingActivity, setBookingActivity] = useState<{ month: string; bookings: number }[]>([]);
  const [registrationTrends, setRegistrationTrends] = useState<{ month: string; users: number }[]>([]);
  const [facilityApprovalTrend, setFacilityApprovalTrend] = useState<ApprovalPoint[]>([]);
  const [mostActiveSports, setMostActiveSports] = useState<{ name: string; value: number }[]>([]);
  const [earnings, setEarnings] = useState<{ month: string; earnings: number }[]>([]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [ba, ur, fa, ms, es] = await Promise.all([
          getBookingsActivity(180),
          getUserRegistrations(180),
          getApprovalTrend(180),
          getActiveSports(5),
          getEarningsSimulation(),
        ]);

        if (!isMounted) return;
        setBookingActivity((ba.data || []).map((d) => ({ month: d.date, bookings: d.count })));
        setRegistrationTrends((ur.data || []).map((d) => ({ month: d.date, users: d.count })));
        setFacilityApprovalTrend(fa.data || []);
        setMostActiveSports(Array.isArray(ms) ? ms : []);
        setEarnings(es || []);
      } catch (e) {
        if (!isMounted) return;
        setBookingActivity([]);
        setRegistrationTrends([]);
        setFacilityApprovalTrend([]);
        setMostActiveSports([]);
        setEarnings([]);
      }
    })();
    return () => { isMounted = false };
  }, []);

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
            <XAxis dataKey="date" />
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
            data={Array.isArray(mostActiveSports) ? mostActiveSports : []}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {Array.isArray(mostActiveSports) &&
              mostActiveSports.map((entry, index) => (
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
          <LineChart data={earnings}>
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
