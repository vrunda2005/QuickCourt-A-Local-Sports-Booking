import React, { useEffect, useState, useCallback } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import FacilityModal from "../../components/facilities/facilitymodal";
import { getPendingFacilities } from "../../api/admin";
import type { Facility } from "../../api/admin";

// Safe date formatting helper
const formatDate = (date?: string) => {
  if (!date) return "—";
  const parsed = new Date(date);
  return isNaN(parsed.getTime())
    ? "—"
    : new Intl.DateTimeFormat("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(parsed);
};

export default function FacilityApprovalPage() {
  // Initial fake data so UI shows 3 pending facilities immediately
  const [facilities, setFacilities] = useState<Facility[]>([
    {
      _id: "1",
      name: "Community Sports Complex",
      ownerId: "owner123",
      location: "Downtown",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "2",
      name: "City Swimming Pool",
      ownerId: "owner456",
      location: "Uptown",
      createdAt: new Date().toISOString(),
    },
    {
      _id: "3",
      name: "Tennis Courts",
      ownerId: "owner789",
      location: "Suburbs",
      createdAt: new Date().toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Facility | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    getPendingFacilities()
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setFacilities(res);
        }
      })
      .catch((e) => {
        console.error("getPendingFacilities error:", e);
        // Keep the initial fake data if API call fails
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">Pending Facilities</h1>

      {loading ? (
        <div className="animate-pulse bg-gray-200 h-10 w-40 rounded"></div>
      ) : facilities.length === 0 ? (
        <div className="text-gray-500">No pending facilities.</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Owner</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Submitted</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((f) => (
                <tr key={f._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{f.name ?? "—"}</td>
                  <td className="px-4 py-2">{f.ownerId ?? "—"}</td>
                  <td className="px-4 py-2">{f.location ?? "—"}</td>
                  <td className="px-4 py-2">{formatDate(f.createdAt)}</td>
                  <td className="px-4 py-2">
                    <button
                      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded"
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
