import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

type BookingData = { date: string; bookings: number };

export default function BookingActivityChart() {
  const [data, setData] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookingData() {
      try {
        const res = await fetch("/admin/stats/bookings-activity?days=30");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to fetch booking activity data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookingData();
  }, []);

  if (loading) return <p>Loading booking activity...</p>;
  if (data.length === 0) return <p>No booking activity data found.</p>;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          tickFormatter={date => new Date(date).toLocaleDateString()}
        />
        <YAxis />
        <Tooltip labelFormatter={date => new Date(date).toLocaleDateString()} />
        <Line type="monotone" dataKey="bookings" stroke="#4f46e5" />
      </LineChart>
    </ResponsiveContainer>
  );
}
