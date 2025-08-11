import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

type Court = {
    _id: string;
    name: string;
    sportType: string;
    pricePerHour: number;
    operatingHours: string;
};

const CourtManagement = ({ facilityId }: { facilityId: string }) => {
    const [courts, setCourts] = useState<Court[]>([]);
    const [newCourt, setNewCourt] = useState({ name: '', sportType: '', pricePerHour: 0, operatingHours: '' });
    const { getToken } = useAuth();

    const load = async () => {
        try {
            const token = await getToken();
            const res = await axios.get(`http://localhost:5000/api/courts/facility/${facilityId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCourts(res.data.data || []);
        } catch (err) {
            setCourts([]);
        }
    };

    useEffect(() => {
        if (facilityId) load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facilityId]);

    const handleAddCourt = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const payload = { ...newCourt, facility: facilityId };
            const res = await axios.post(
                `http://localhost:5000/api/courts`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCourts((prev) => [...prev, res.data.data]);
            setNewCourt({ name: '', sportType: '', pricePerHour: 0, operatingHours: '' });
        } catch (err) {
            // noop
        }
    };

    const handleDelete = async (courtId: string) => {
        try {
            const token = await getToken();
            await axios.delete(
                `http://localhost:5000/api/courts/${courtId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setCourts((prev) => prev.filter(c => c._id !== courtId));
        } catch (err) {
            // noop
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Court Management</h1>
            <div className="mb-6">
                <h2 className="font-bold mb-2">Existing Courts</h2>
                <table className="w-full bg-white shadow rounded">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-2">Name</th>
                            <th className="p-2">Sport</th>
                            <th className="p-2">Price/Hour</th>
                            <th className="p-2">Operating Hours</th>
                            <th className="p-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courts.map(court => (
                            <tr key={court._id}>
                                <td className="p-2">{court.name}</td>
                                <td className="p-2">{court.sportType}</td>
                                <td className="p-2">${court.pricePerHour}</td>
                                <td className="p-2">{court.operatingHours}</td>
                                <td className="p-2">
                                    <button onClick={() => handleDelete(court._id)} className="text-red-500">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <form onSubmit={handleAddCourt} className="bg-white p-4 shadow rounded">
                <div className="mb-4">
                    <label className="block font-semibold">Court Name</label>
                    <input type="text" className="w-full p-2 border rounded" value={newCourt.name} onChange={(e) => setNewCourt({ ...newCourt, name: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Sport Type</label>
                    <input type="text" className="w-full p-2 border rounded" value={newCourt.sportType} onChange={(e) => setNewCourt({ ...newCourt, sportType: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Price per Hour</label>
                    <input type="number" className="w-full p-2 border rounded" value={newCourt.pricePerHour} onChange={(e) => setNewCourt({ ...newCourt, pricePerHour: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Operating Hours</label>
                    <input type="text" className="w-full p-2 border rounded" value={newCourt.operatingHours} onChange={(e) => setNewCourt({ ...newCourt, operatingHours: e.target.value })} />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Court</button>
            </form>
        </div>
    );
};

export default CourtManagement;
