// src/components/Charts/BookingsChart.tsx
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getBookingsActivity, ChartResponse } from "../../api/admin";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function BookingsChart({ period = 30 }: { period?: number }) {
  const [data, setData] = useState<ChartResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBookingsActivity(period)
      .then((res) => setData(res))
      .catch((e) => {
        console.error("BookingsChart error:", e);
        setData({ period, data: [] });
      })
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <div className="bg-white p-4 rounded shadow">Loading chart…</div>;
  const labels = (data?.data || []).map((p) => p.date);
  const values = (data?.data || []).map((p) => p.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Bookings",
        data: values,
        tension: 0.2,
        fill: false,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="text-sm text-gray-600 mb-2">Booking Activity (last {period} days)</div>
      <Line data={chartData} />
    </div>
  );
}
