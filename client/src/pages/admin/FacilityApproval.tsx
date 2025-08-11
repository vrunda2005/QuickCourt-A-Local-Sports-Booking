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
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Facility | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    getPendingFacilities()
      .then((res) => setFacilities(Array.isArray(res) ? res : []))
      .catch((e) => {
        console.error("getPendingFacilities error:", e);
        setFacilities([]);
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

/*import React, { useEffect, useState } from "react";
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
        setFacilities(Array.isArray(res) ? res : []);
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
                  <td className="px-4 py-2">{f.ownerId}</td>
                  <td className="px-4 py-2">{f.location}</td>
                  <td className="px-4 py-2">{new Date(f.createdAt).toLocaleDateString()}</td>
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
*/