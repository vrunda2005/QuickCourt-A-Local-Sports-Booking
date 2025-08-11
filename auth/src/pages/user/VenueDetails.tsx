import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';

type Facility = {
    _id: string;
    name: string;
    location: string;
    description?: string;
    imageUrl?: string;
};

const VenueDetails: React.FC = () => {
    const { id } = useParams();
    const [facility, setFacility] = useState<Facility | null>(null);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [message, setMessage] = useState('');
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        const fetchFacility = async () => {
            const res = await axios.get(`http://localhost:5000/api/facilities/${id}`);
            setFacility(res.data.data);
        };
        if (id) fetchFacility();
    }, [id]);

    const book = async () => {
        try {
            if (!isSignedIn) {
                setMessage('Please sign in to book');
                return;
            }
            const token = await getToken();
            await axios.post(
                'http://localhost:5000/api/bookings',
                { facilityId: id, date, timeSlot },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Booked successfully');
        } catch (err: any) {
            setMessage(err.response?.data?.error || 'Booking failed');
        }
    };

    if (!facility) return <div>Loading...</div>;

    return (
        <div>
            <h2>{facility.name}</h2>
            <div>{facility.location}</div>
            <p>{facility.description}</p>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input placeholder="Time Slot (e.g., 10:00-11:00)" value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} />
                <button onClick={book}>Book Now</button>
            </div>
            {message && <div style={{ marginTop: 8 }}>{message}</div>}
        </div>
    );
};

export default VenueDetails;



