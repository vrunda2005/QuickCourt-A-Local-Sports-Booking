import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';

const Profile: React.FC = () => {
    const { user } = useUser();
    const [name, setName] = useState('');

    useEffect(() => {
        if (user) setName(`${user.firstName || ''} ${user.lastName || ''}`.trim());
    }, [user]);

    return (
        <div>
            <h2>Profile</h2>
            <div>Email: {user?.primaryEmailAddress?.emailAddress}</div>
            <div style={{ marginTop: 8 }}>
                <label>
                    Full Name:
                    <input value={name} onChange={(e) => setName(e.target.value)} />
                </label>
            </div>
        </div>
    );
};

export default Profile;



