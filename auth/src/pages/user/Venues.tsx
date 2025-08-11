import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

type Facility = {
    _id: string;
    name: string;
    location: string;
    description?: string;
    imageUrl?: string;
};

const Venues: React.FC = () => {
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [query, setQuery] = useState('');
    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/facilities');
                setFacilities(res.data.data || []);
            } catch (error) {
                setFacilities([]);
            }
        };
        fetchFacilities();
    }, []);
    const filtered = facilities.filter((f) =>
        [f.name, f.location, f.description].join(' ').toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div>
            <h2>Venues</h2>
            <input
                placeholder="Search venues"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ marginBottom: 12, width: 260 }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
                {filtered.map((f) => (
                    <div key={f._id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
                        <h4>{f.name}</h4>
                        <div>{f.location}</div>
                        <p style={{ color: '#555' }}>{f.description || 'No description'}</p>
                        <Link to={`/venues/${f._id}`}>View</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Venues;



