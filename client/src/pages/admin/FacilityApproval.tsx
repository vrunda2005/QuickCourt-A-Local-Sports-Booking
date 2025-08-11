import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import FacilityModal from "../../components/facilities/facilitymodal";
import { getPendingFacilities} from "../../api/admin";

import type { Facility } from "../../api/admin";

export default function FacilityApprovalPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Facility | null>(null);
const loadData = () => {
  setLoading(true);
  getPendingFacilities()
    .then((res) => {
      if (Array.isArray(res)) {
        setFacilities(res);
      } else if (res && Array.isArray(res.facilities)) {
        setFacilities(res.facilities);
      } else {
        console.error("Unexpected API format:", res);
        setFacilities([]);
      }
    })
    .catch((e) => {
      console.error("getPendingFacilities error:", e);
      setFacilities([]);
    })
    .finally(() => setLoading(false));
};


  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Pending Facilities</h1>
      {loading ? (
        <div>Loading…</div>
      ) : facilities.length === 0 ? (
        <div className="text-gray-500">No pending facilities.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Owner</th>
                <th className="text-left px-4 py-2">Location</th>
                <th className="text-left px-4 py-2">Submitted</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f._id} className="border-t">
                  <td className="px-4 py-2">{f.name}</td>
                  <td className="px-4 py-2">{f.ownerName}</td>
                  <td className="px-4 py-2">{f.location}</td>
                  <td className="px-4 py-2">{new Date(f.submittedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded"
                      onClick={() => setSelected(f)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <FacilityModal
          facility={selected}
          onClose={() => setSelected(null)}
          onAction={loadData}
        />
      )}
    </AdminLayout>
  );
}
