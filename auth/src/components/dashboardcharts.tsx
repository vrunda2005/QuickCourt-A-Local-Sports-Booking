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
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  getBookingsActivity,
  getUserRegistrations,
  getApprovalTrend,
  getActiveSports,
  getEarningsSimulation,
} from "../api/admin";
import { Calendar, Users, CheckCircle2, Activity, DollarSign } from "lucide-react";

const colors = ["#4F46E5", "#16A34A", "#F59E0B", "#EF4444"] as const;

type ApprovalPoint = { date: string; approved: number; rejected: number };

export default function DashboardCharts() {
  const [bookingActivity, setBookingActivity] = useState<{ month: string; bookings: number }[]>([
    { month: "Jan", bookings: 0 },
    { month: "Feb", bookings: 0 },
  ]);
  const [registrationTrends, setRegistrationTrends] = useState<{ month: string; users: number }[]>([
    { month: "Jan", users: 0 },
    { month: "Feb", users: 0 },
  ]);
  const [facilityApprovalTrend, setFacilityApprovalTrend] = useState<ApprovalPoint[]>([
    { date: "Jan", approved: 0, rejected: 0 },
    { date: "Feb", approved: 0, rejected: 0 },
  ]);
  const [mostActiveSports, setMostActiveSports] = useState<{ name: string; value: number }[]>([
    { name: "No Data", value: 1 },
  ]);
  const [earnings, setEarnings] = useState<{ month: string; earnings: number }[]>([
    { month: "Jan", earnings: 0 },
    { month: "Feb", earnings: 0 },
  ]);

  const safeArray = (x: any): any[] => (Array.isArray(x) ? x : []);

  const normalizeSport = (s: any) => ({
    name: s?.name ?? s?.label ?? "Unknown",
    value: typeof s?.value === "number" ? s.value : s?.count ?? 0,
  });

  const normalizeEarning = (e: any) => ({
    month: e?.month ?? e?.date ?? "Unknown",
    earnings: typeof e?.earnings === "number" ? e.earnings : e?.amount ?? 0,
  });
useEffect(() => {
  // directly set fake data (no API calls)
  setBookingActivity([
    { month: "Jan", bookings: 20 },
    { month: "Feb", bookings: 35 },
    { month: "Mar", bookings: 40 },
    { month: "Apr", bookings: 25 },
    { month: "May", bookings: 30 },
    { month: "Jun", bookings: 45 },
  ]);
  setRegistrationTrends([
    { month: "Jan", users: 10 },
    { month: "Feb", users: 15 },
    { month: "Mar", users: 12 },
    { month: "Apr", users: 20 },
    { month: "May", users: 18 },
    { month: "Jun", users: 22 },
  ]);
  setFacilityApprovalTrend([
    { date: "Jan", approved: 8, rejected: 2 },
    { date: "Feb", approved: 9, rejected: 3 },
    { date: "Mar", approved: 10, rejected: 1 },
    { date: "Apr", approved: 7, rejected: 4 },
    { date: "May", approved: 8, rejected: 2 },
    { date: "Jun", approved: 9, rejected: 3 },
  ]);
  setMostActiveSports([
    { name: "Football", value: 15 },
    { name: "Tennis", value: 9 },
    { name: "Basketball", value: 6 },
    { name: "Swimming", value: 3 },
  ]);
  setEarnings([
    { month: "Jan", earnings: 1000 },
    { month: "Feb", earnings: 1200 },
    { month: "Mar", earnings: 1100 },
    { month: "Apr", earnings: 1300 },
    { month: "May", earnings: 1250 },
    { month: "Jun", earnings: 1400 },
  ]);
}, []);


  const Card = ({ title, icon, children, color }: { title: string; icon: React.ReactNode; children: React.ReactNode; color: string }) => (
    <div className={`rounded-xl shadow-sm border border-gray-100 p-4 bg-gradient-to-tr from-${color}-50 to-white`}>
      <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-gray-800">
        {icon}
        {title}
      </h2>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card title="Booking Activity Over Time" icon={<Calendar className="h-5 w-5 text-indigo-600" />} color="indigo">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={bookingActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="bookings" stroke="#4F46E5" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card title="User Registration Trends" icon={<Users className="h-5 w-5 text-green-600" />} color="green">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={registrationTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#16A34A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Facility Approval Trend" icon={<CheckCircle2 className="h-5 w-5 text-blue-600" />} color="blue">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={facilityApprovalTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="approved" fill="#4F46E5" radius={[6, 6, 0, 0]} />
            <Bar dataKey="rejected" fill="#EF4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Most Active Sports" icon={<Activity className="h-5 w-5 text-orange-600" />} color="orange">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={mostActiveSports} dataKey="value" nameKey="name" outerRadius={90} label>
              {mostActiveSports.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      <Card title="Earnings Simulation" icon={<DollarSign className="h-5 w-5 text-yellow-600" />} color="yellow">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={earnings}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="earnings" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}

/*import React, { useEffect, useState } from "react";
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
*/
