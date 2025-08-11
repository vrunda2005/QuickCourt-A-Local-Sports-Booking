import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

export default function EarningsChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/admin/stats/earnings-simulation")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Bar dataKey="earnings" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
}
