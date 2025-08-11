import { useState, useEffect } from 'react';

const CourtManagement = () => {
    const [courts, setCourts] = useState<any[]>([]);
    const [newCourt, setNewCourt] = useState({ name: '', sport: '', price: 0, hours: '' });

    useEffect(() => {
        setCourts([
            { id: 1, name: 'Court 1', sport: 'Tennis', price: 20, hours: '9AM-9PM' },
            { id: 2, name: 'Court 2', sport: 'Basketball', price: 25, hours: '10AM-8PM' },
        ]);
    }, []);

    const handleAddCourt = async (e: React.FormEvent) => {
        e.preventDefault();
        setCourts([...courts, { ...newCourt, id: courts.length + 1 }]);
        setNewCourt({ name: '', sport: '', price: 0, hours: '' });
    };

    const handleDelete = async (id: number) => {
        setCourts(courts.filter(court => court.id !== id));
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
                            <tr key={court.id}>
                                <td className="p-2">{court.name}</td>
                                <td className="p-2">{court.sport}</td>
                                <td className="p-2">${court.price}</td>
                                <td className="p-2">{court.hours}</td>
                                <td className="p-2">
                                    <button className="text-blue-500 mr-2">Edit</button>
                                    <button onClick={() => handleDelete(court.id)} className="text-red-500">Delete</button>
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
                    <input type="text" className="w-full p-2 border rounded" value={newCourt.sport} onChange={(e) => setNewCourt({ ...newCourt, sport: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Price per Hour</label>
                    <input type="number" className="w-full p-2 border rounded" value={newCourt.price} onChange={(e) => setNewCourt({ ...newCourt, price: parseFloat(e.target.value) })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Operating Hours</label>
                    <input type="text" className="w-full p-2 border rounded" value={newCourt.hours} onChange={(e) => setNewCourt({ ...newCourt, hours: e.target.value })} />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Court</button>
            </form>
        </div>
    );
};

export default CourtManagement;



