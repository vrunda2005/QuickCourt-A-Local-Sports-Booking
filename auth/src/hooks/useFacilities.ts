import { useEffect, useState } from 'react';
import { listFacilities } from '../api/facilities';

export function useFacilities() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listFacilities();
        setData(res.data.data || []);
      } catch (e: any) {
        setError(e?.message || 'Failed to load facilities');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { data, loading, error };
}



