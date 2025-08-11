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
import {
  getBookingsActivity,
  getUserRegistrations,
  getApprovalTrend,
  getActiveSports,
  getEarningsSimulation
} from "../api/admin";

const colors = ["#4F46E5", "#16A34A", "#F59E0B", "#EF4444"] as const;

type ApprovalPoint = { date: string; approved: number; rejected: number };

export default function DashboardCharts() {
  // typed initial states are fine; we'll still defensive-check later.
  const [bookingActivity, setBookingActivity] = useState<{ month: string; bookings: number }[]>([]);
  const [registrationTrends, setRegistrationTrends] = useState<{ month: string; users: number }[]>([]);
  const [facilityApprovalTrend, setFacilityApprovalTrend] = useState<ApprovalPoint[]>([]);
  const [mostActiveSports, setMostActiveSports] = useState<{ name: string; value: number }[]>([]);
  const [earnings, setEarnings] = useState<{ month: string; earnings: number }[]>([]);

  // helper to ensure .map() always works
  const safeArray = (x: any): any[] => (Array.isArray(x) ? x : x ? [x] : []);

  // helpers to normalize incoming items
  const normalizeSport = (s: any) => {
    if (!s) return { name: "Unknown", value: 0 };
    if (typeof s === "string") return { name: s, value: 1 };
    return {
      name: s.name ?? s.label ?? s.title ?? String(s),
      value: typeof s.value === "number" ? s.value : (s.count ?? s.amount ?? s.total ?? 0)
    };
  };

  const normalizeEarning = (e: any) => {
    if (!e) return { month: "Unknown", earnings: 0 };
    return {
      month: e.month ?? e.date ?? e.label ?? String(e),
      earnings: typeof e.earnings === "number" ? e.earnings : (e.amount ?? e.value ?? 0)
    };
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const [ba, ur, fa, ms, es] = await Promise.all([
          getBookingsActivity(180),
          getUserRegistrations(180),
          getApprovalTrend(180),
          getActiveSports(5),
          getEarningsSimulation()
        ]);

        if (!isMounted) return;

        // Debug: paste this output here if things still break
        console.log("API results:", { ba, ur, fa, ms, es });

        // Try .data first (common axios shape), otherwise the root, otherwise empty
        const baArr = Array.isArray(ba?.data) ? ba.data : (Array.isArray(ba) ? ba : []);
        const urArr = Array.isArray(ur?.data) ? ur.data : (Array.isArray(ur) ? ur : []);
        const faArr = Array.isArray(fa?.data) ? fa.data : (Array.isArray(fa) ? fa : []);
        const msArr = Array.isArray(ms?.data) ? ms.data : (Array.isArray(ms) ? ms : []);
        const esArr = Array.isArray(es?.data) ? es.data : (Array.isArray(es) ? es : []);

        setBookingActivity(baArr.map((d: any) => ({ month: d.date ?? d.month ?? String(d), bookings: d.count ?? d.bookings ?? 0 })));
        setRegistrationTrends(urArr.map((d: any) => ({ month: d.date ?? d.month ?? String(d), users: d.count ?? d.users ?? 0 })));
        setFacilityApprovalTrend(faArr.map((d: any) => ({ date: d.date ?? d.month ?? String(d), approved: d.approved ?? d.approvals ?? 0, rejected: d.rejected ?? d.rejections ?? 0 })));
        setMostActiveSports(msArr.map(normalizeSport));
        setEarnings(esArr.map(normalizeEarning));
      } catch (e) {
        if (!isMounted) return;
        console.error("error loading dashboard charts:", e);
        setBookingActivity([]);
        setRegistrationTrends([]);
        setFacilityApprovalTrend([]);
        setMostActiveSports([]);
        setEarnings([]);
      }
    })();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Booking Activity */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Booking Activity Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={safeArray(bookingActivity)}>
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
          <BarChart data={safeArray(registrationTrends)}>
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
          <BarChart data={safeArray(facilityApprovalTrend)}>
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
              data={safeArray(mostActiveSports)}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {safeArray(mostActiveSports).map((entry, index) => (
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
          <LineChart data={safeArray(earnings)}>
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
