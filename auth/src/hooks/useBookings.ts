import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { getMyBookings } from '../api/bookings';

export function useBookings() {
  const { getToken } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const token = await getToken();
        const res = await getMyBookings(token || '');
        setData(res.data.data || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, [getToken]);

  return { data, loading, error };
}



