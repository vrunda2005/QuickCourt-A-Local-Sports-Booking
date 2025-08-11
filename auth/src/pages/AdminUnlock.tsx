import React, { useState } from 'react';
import { promoteToAdmin } from '../api/auth';
import { useAuth } from '@clerk/clerk-react';

const AdminUnlock: React.FC = () => {
  const [secret, setSecret] = useState('');
  const [message, setMessage] = useState('');
  const { getToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const token = await getToken();
      if (!token) throw new Error('No token');
      await promoteToAdmin(secret, token);
      setMessage('Admin role granted to your account.');
    } catch (err: any) {
      setMessage(err.response?.data?.error || 'Invalid secret');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320 }}>
        <h3>Admin Unlock</h3>
        <input
          type="password"
          placeholder="Enter admin secret"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
        />
        <button type="submit">Unlock</button>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
};

export default AdminUnlock;


