import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';

type Role = 'User' | 'FacilityOwner' | 'Admin' | null;

type RoleContextValue = {
    role: Role;
    loading: boolean;
    reload: () => Promise<void>;
};

const RoleContext = createContext<RoleContextValue>({ role: null, loading: true, reload: async () => { } });

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getToken, isSignedIn } = useAuth();
    const [role, setRole] = useState<Role>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const load = async () => {
        if (!isSignedIn) {
            setRole(null);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const token = await getToken();
            // Ensure the user exists in MongoDB
            await axios.post('http://localhost:5000/api/users/sync', {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Then fetch the role
            const res = await axios.get('http://localhost:5000/api/users/me', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRole(res.data.user?.role || null);
        } catch (_err) {
            setRole(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn]);

    return (
        <RoleContext.Provider value={{ role, loading, reload: load }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => useContext(RoleContext);


