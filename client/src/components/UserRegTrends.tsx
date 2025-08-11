import React, { useState, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";

export default function UserRegistrationChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/admin/stats/user-registrations")
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="users" stroke="#82ca9d" />
      </LineChart>
    </ResponsiveContainer>
  );
}
