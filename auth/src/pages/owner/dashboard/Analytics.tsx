import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const trends = [
    { name: 'Mon', bookings: 4 },
    { name: 'Tue', bookings: 6 },
    { name: 'Wed', bookings: 8 },
    { name: 'Thu', bookings: 5 },
    { name: 'Fri', bookings: 7 },
    { name: 'Sat', bookings: 9 },
    { name: 'Sun', bookings: 3 },
];

const earnings = [
    { name: 'Mon', earnings: 120 },
    { name: 'Tue', earnings: 180 },
    { name: 'Wed', earnings: 240 },
    { name: 'Thu', earnings: 150 },
    { name: 'Fri', earnings: 210 },
    { name: 'Sat', earnings: 270 },
    { name: 'Sun', earnings: 90 },
];

const Analytics = () => {
    const [kpis] = useState({ totalBookings: 42, activeCourts: 5, earnings: 1200 });

    useEffect(() => {
        // Replace with API calls as needed
    }, []);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-semibold">Total Bookings</h3>
                    <p className="text-3xl">{kpis.totalBookings}</p>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-semibold">Active Courts</h3>
                    <p className="text-3xl">{kpis.activeCourts}</p>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-semibold">Earnings</h3>
                    <p className="text-3xl">${kpis.earnings}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl font-bold mb-2">Booking Trends</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={trends}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="bookings" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-2">Earnings Summary</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={earnings}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="earnings" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;


