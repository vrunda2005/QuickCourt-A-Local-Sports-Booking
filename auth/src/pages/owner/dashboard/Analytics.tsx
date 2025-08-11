import { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface AnalyticsData {
  totalBookings: number;
  activeCourts: number;
  earnings: number;
  weeklyBookings: Array<{ name: string; bookings: number }>;
  weeklyEarnings: Array<{ name: string; earnings: number }>;
  monthlyBookings: Array<{ name: string; bookings: number }>;
  monthlyEarnings: Array<{ name: string; earnings: number }>;
  dailyBookings: Array<{ name: string; bookings: number }>;
  dailyEarnings: Array<{ name: string; earnings: number }>;
  peakHours: Array<{ hour: string; bookings: number }>;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

const Analytics = () => {
    const [data, setData] = useState<AnalyticsData>({
        totalBookings: 0,
        activeCourts: 0,
        earnings: 0,
        weeklyBookings: [],
        weeklyEarnings: [],
        monthlyBookings: [],
        monthlyEarnings: [],
        dailyBookings: [],
        dailyEarnings: [],
        peakHours: []
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>('weekly');
    const { getToken } = useAuth();

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                setLoading(true);
                const token = await getToken();
                
                const facilitiesRes = await axios.get('http://localhost:5000/api/facilities/mine', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const facilities = facilitiesRes.data.data || [];
                let totalCourts = 0;
                let totalBookings = 0; // This would need actual booking data from backend
                let totalEarnings = 0;
                
                for (const facility of facilities) {
                    if (facility.status === 'approved') {
                        try {
                            const courtsRes = await axios.get(`http://localhost:5000/api/courts?facility=${facility._id}`, {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const courts = courtsRes.data.data || [];
                            totalCourts += courts.length;
                            
                            totalEarnings += courts.reduce((sum: number, court: any) => sum + (court.pricePerHour || 0), 0);
                        } catch (error) {
                            console.error('Failed to load courts for facility:', facility._id);
                        }
                    }
                }
                
                // Generate sample data for different time ranges
                const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                const monthDays = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
                const dayHours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
                
                const weeklyBookings = weekDays.map(day => ({
                    name: day,
                    bookings: Math.floor(Math.random() * 10) + 1
                }));
                
                const weeklyEarnings = weekDays.map(day => ({
                    name: day,
                    earnings: Math.floor(Math.random() * 200) + 50
                }));

                const monthlyBookings = monthDays.map(day => ({
                    name: day,
                    bookings: Math.floor(Math.random() * 8) + 1
                }));
                
                const monthlyEarnings = monthDays.map(day => ({
                    name: day,
                    earnings: Math.floor(Math.random() * 150) + 30
                }));

                const dailyBookings = dayHours.map(hour => ({
                    name: hour,
                    bookings: Math.floor(Math.random() * 5) + 1
                }));
                
                const dailyEarnings = dayHours.map(hour => ({
                    name: hour,
                    earnings: Math.floor(Math.random() * 100) + 20
                }));

                // Peak hours data (more realistic pattern)
                const peakHours = dayHours.map(hour => {
                    const hourNum = parseInt(hour.split(':')[0]);
                    let bookings = 1;
                    
                    // Peak hours: 6-9 AM, 5-9 PM
                    if ((hourNum >= 6 && hourNum <= 9) || (hourNum >= 17 && hourNum <= 21)) {
                        bookings = Math.floor(Math.random() * 8) + 5; // 5-12 bookings
                    } else if (hourNum >= 10 && hourNum <= 16) {
                        bookings = Math.floor(Math.random() * 4) + 2; // 2-5 bookings
                    } else {
                        bookings = Math.floor(Math.random() * 2) + 1; // 1-2 bookings
                    }
                    
                    return { hour, bookings };
                });
                
                setData({
                    totalBookings,
                    activeCourts: totalCourts,
                    earnings: totalEarnings,
                    weeklyBookings,
                    weeklyEarnings,
                    monthlyBookings,
                    monthlyEarnings,
                    dailyBookings,
                    dailyEarnings,
                    peakHours
                });
            } catch (error) {
                console.error('Failed to load analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadAnalytics();
    }, [getToken]);

    const getCurrentData = () => {
        switch (timeRange) {
            case 'daily':
                return {
                    bookings: data.dailyBookings,
                    earnings: data.dailyEarnings,
                    label: 'Daily'
                };
            case 'monthly':
                return {
                    bookings: data.monthlyBookings,
                    earnings: data.monthlyEarnings,
                    label: 'Monthly'
                };
            default:
                return {
                    bookings: data.weeklyBookings,
                    earnings: data.weeklyEarnings,
                    label: 'Weekly'
                };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading analytics...</div>
            </div>
        );
    }

    const currentData = getCurrentData();

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-semibold text-gray-700">Total Bookings</h3>
                    <p className="text-3xl font-bold text-blue-600">{data.totalBookings}</p>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-semibold text-gray-700">Active Courts</h3>
                    <p className="text-3xl font-bold text-green-600">{data.activeCourts}</p>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h3 className="font-semibold text-gray-700">Potential Earnings</h3>
                    <p className="text-3xl font-bold text-purple-600">₹{data.earnings}/hr</p>
                </div>
            </div>
            
            {/* Time Range Toggle */}
            <div className="bg-white p-4 shadow rounded mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Booking Trends</h2>
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setTimeRange('daily')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                timeRange === 'daily' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Daily
                        </button>
                        <button
                            onClick={() => setTimeRange('weekly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                timeRange === 'weekly' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Weekly
                        </button>
                        <button
                            onClick={() => setTimeRange('monthly')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                timeRange === 'monthly' 
                                    ? 'bg-white text-gray-900 shadow-sm' 
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{currentData.label} Booking Trends</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={currentData.bookings}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="bookings" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">{currentData.label} Earnings Projection</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={currentData.earnings}>
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

            {/* Peak Hours Heatmap */}
            <div className="bg-white p-4 shadow rounded mb-6">
                <h2 className="text-xl font-bold mb-4">Peak Booking Hours</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data.peakHours}>
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                            type="monotone" 
                            dataKey="bookings" 
                            stroke="#8884d8" 
                            fill="#8884d8" 
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                </ResponsiveContainer>
                <div className="mt-4 text-sm text-gray-600">
                    <p>• Peak hours: 6-9 AM and 5-9 PM show highest booking activity</p>
                    <p>• Mid-day hours (10 AM - 4 PM) have moderate activity</p>
                    <p>• Late night hours (10 PM - 5 AM) have minimal activity</p>
                </div>
            </div>
            
            <div className="mt-6 bg-white p-4 shadow rounded">
                <h2 className="text-xl font-bold mb-4">Analytics Summary</h2>
                <div className="text-gray-600">
                    <p>• Your facilities have {data.activeCourts} active courts available for booking</p>
                    <p>• Potential hourly earnings: ₹{data.earnings} across all courts</p>
                    <p>• Use the toggle above to view daily, weekly, or monthly trends</p>
                    <p>• Peak hours analysis helps optimize court availability and pricing</p>
                </div>
            </div>
        </div>
    );
};

export default Analytics;


