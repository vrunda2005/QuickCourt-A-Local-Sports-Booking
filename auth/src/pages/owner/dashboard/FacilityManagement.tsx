import { useState, useEffect } from 'react';

const FacilityManagement = () => {
    const [facility, setFacility] = useState({
        name: '',
        location: '',
        description: '',
        sports: '',
        amenities: '',
        photos: [] as any,
    });

    useEffect(() => {
        setFacility({
            name: 'Sample Facility',
            location: '123 Main St',
            description: 'A great sports facility',
            sports: 'Tennis, Basketball',
            amenities: 'Parking, Showers',
            photos: [],
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Facility updated:', facility);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Facility Management</h1>
            <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded">
                <div className="mb-4">
                    <label className="block font-semibold">Name</label>
                    <input type="text" className="w-full p-2 border rounded" value={facility.name} onChange={(e) => setFacility({ ...facility, name: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Location</label>
                    <input type="text" className="w-full p-2 border rounded" value={facility.location} onChange={(e) => setFacility({ ...facility, location: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Description</label>
                    <textarea className="w-full p-2 border rounded" value={facility.description} onChange={(e) => setFacility({ ...facility, description: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Sports Supported</label>
                    <input type="text" className="w-full p-2 border rounded" value={facility.sports} onChange={(e) => setFacility({ ...facility, sports: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Amenities</label>
                    <input type="text" className="w-full p-2 border rounded" value={facility.amenities} onChange={(e) => setFacility({ ...facility, amenities: e.target.value })} />
                </div>
                <div className="mb-4">
                    <label className="block font-semibold">Upload Photos</label>
                    <input type="file" multiple className="w-full p-2 border rounded" onChange={(e) => setFacility({ ...facility, photos: e.target.files as any })} />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
            </form>
        </div>
    );
};

export default FacilityManagement;



