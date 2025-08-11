import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

interface Facility {
    _id: string;
    name: string;
    location: string;
    description: string;
    sports: string;
    amenities: string;
    status: string;
}

interface CourtTemplate {
    name: string;
    sportType: string;
    pricePerHour: number;
    operatingHours: string;
    amenities: string;
}

const FacilityManagement = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [facility, setFacility] = useState({
        name: '',
        location: '',
        description: '',
        sports: '',
        amenities: '',
        photos: [] as any,
    });
    const [courts, setCourts] = useState<CourtTemplate[]>([
        {
            name: 'Court 1',
            sportType: 'Badminton',
            pricePerHour: 500,
            operatingHours: '06:00-22:00',
            amenities: 'Professional flooring, Lighting, Equipment'
        }
    ]);
    const [loading, setLoading] = useState(false);
    const { getToken } = useAuth();

    const loadFacilities = async () => {
        try {
            const token = await getToken();
            const res = await axios.get('http://localhost:5000/api/facilities/mine', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFacilities(res.data.data || []);
        } catch (error) {
            console.error('Failed to load facilities:', error);
        }
    };

    useEffect(() => {
        loadFacilities();
    }, []);

    const addCourt = () => {
        setCourts([...courts, {
            name: `Court ${courts.length + 1}`,
            sportType: 'Badminton',
            pricePerHour: 500,
            operatingHours: '06:00-22:00',
            amenities: 'Professional flooring, Lighting, Equipment'
        }]);
    };

    const removeCourt = (index: number) => {
        if (courts.length > 1) {
            setCourts(courts.filter((_, i) => i !== index));
        }
    };

    const updateCourt = (index: number, field: keyof CourtTemplate, value: string | number) => {
        const newCourts = [...courts];
        newCourts[index] = { ...newCourts[index], [field]: value };
        setCourts(newCourts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            const token = await getToken();

            // First create the facility
            const formData = new FormData();
            formData.append('name', facility.name);
            formData.append('location', facility.location);
            formData.append('description', facility.description);
            formData.append('sports', facility.sports);
            formData.append('amenities', facility.amenities);
            if (facility.photos && (facility.photos as FileList).length > 0) {
                formData.append('image', (facility.photos as FileList)[0]);
            }

            const facilityRes = await axios.post(
                'http://localhost:5000/api/facilities',
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const newFacility = facilityRes.data.data;
            console.log('Facility created:', newFacility);

            // Then create all the courts for this facility
            for (const court of courts) {
                try {
                    await axios.post(
                        'http://localhost:5000/api/courts',
                        {
                            ...court,
                            facility: newFacility._id
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );
                } catch (courtError) {
                    console.error('Failed to create court:', court, courtError);
                }
            }

            alert('Facility and courts created successfully! It will be reviewed by an admin.');
            
            // Reset form
            setFacility({
                name: '',
                location: '',
                description: '',
                sports: '',
                amenities: '',
                photos: [],
            });
            setCourts([{
                name: 'Court 1',
                sportType: 'Badminton',
                pricePerHour: 500,
                operatingHours: '06:00-22:00',
                amenities: 'Professional flooring, Lighting, Equipment'
            }]);
            
            // Reload facilities list
            await loadFacilities();
        } catch (err) {
            console.error('Error creating facility:', err);
            alert('Failed to create facility');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Facility Management</h1>
            
            {/* Existing Facilities */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Your Facilities</h2>
                {facilities.length === 0 ? (
                    <p className="text-gray-500">No facilities created yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {facilities.map((f) => (
                            <div key={f._id} className="bg-white p-4 rounded-lg shadow border">
                                <h3 className="font-semibold text-lg">{f.name}</h3>
                                <p className="text-gray-600">{f.location}</p>
                                <p className="text-gray-700 mt-2">{f.description}</p>
                                <div className="mt-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        f.status === 'approved' ? 'bg-green-100 text-green-800' :
                                        f.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create New Facility Form */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Create New Facility</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Facility Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold mb-1">Facility Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={facility.name}
                                onChange={(e) => setFacility({ ...facility, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Location</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={facility.location}
                                onChange={(e) => setFacility({ ...facility, location: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Description</label>
                        <textarea
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows={3}
                            value={facility.description}
                            onChange={(e) => setFacility({ ...facility, description: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold mb-1">Sports Supported</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Badminton, Tennis, Basketball"
                                value={facility.sports}
                                onChange={(e) => setFacility({ ...facility, sports: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Amenities</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Parking, Showers, Equipment Rental"
                                value={facility.amenities}
                                onChange={(e) => setFacility({ ...facility, amenities: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold mb-1">Upload Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            onChange={(e) => setFacility({ ...facility, photos: e.target.files || [] })}
                        />
                    </div>

                    {/* Courts Configuration */}
                    <div className="border-t pt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Configure Courts</h3>
                            <button
                                type="button"
                                onClick={addCourt}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                            >
                                + Add Court
                            </button>
                        </div>

                        <div className="space-y-4">
                            {courts.map((court, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-medium">Court {index + 1}</h4>
                                        {courts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeCourt(index)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Court Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded text-sm"
                                                value={court.name}
                                                onChange={(e) => updateCourt(index, 'name', e.target.value)}
                                                placeholder="e.g., Court A, Table 1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Sport Type</label>
                                            <select
                                                className="w-full p-2 border rounded text-sm"
                                                value={court.sportType}
                                                onChange={(e) => updateCourt(index, 'sportType', e.target.value)}
                                            >
                                                <option value="Badminton">Badminton</option>
                                                <option value="Tennis">Tennis</option>
                                                <option value="Basketball">Basketball</option>
                                                <option value="Football">Football</option>
                                                <option value="Cricket">Cricket</option>
                                                <option value="Swimming">Swimming</option>
                                                <option value="Table Tennis">Table Tennis</option>
                                                <option value="Squash">Squash</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Price per Hour (₹)</label>
                                            <input
                                                type="number"
                                                className="w-full p-2 border rounded text-sm"
                                                value={court.pricePerHour}
                                                onChange={(e) => updateCourt(index, 'pricePerHour', parseInt(e.target.value))}
                                                min="100"
                                                step="50"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Operating Hours</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded text-sm"
                                                value={court.operatingHours}
                                                onChange={(e) => updateCourt(index, 'operatingHours', e.target.value)}
                                                placeholder="e.g., 06:00-22:00"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium mb-1">Amenities</label>
                                            <input
                                                type="text"
                                                className="w-full p-2 border rounded text-sm"
                                                value={court.amenities}
                                                onChange={(e) => updateCourt(index, 'amenities', e.target.value)}
                                                placeholder="e.g., Professional flooring, Lighting, Equipment"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Creating...' : 'Create Facility & Courts'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FacilityManagement;
