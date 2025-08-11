// src/pages/admin/Reports.tsx
import React, { useEffect, useState, useMemo } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import {
  getReports,
  dismissReport,
  banUser,
  unbanUser,
  disableFacility,
  enableFacility
} from "../../api/admin";

type Report = {
  _id: string;
  type: "user" | "facility";
  targetId: string;
  targetName: string;
  reason: string;
  submittedBy: string;
  createdAt: string;
  status: "pending" | "resolved";
};

export default function Reports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "user" | "facility">("all");

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await getReports();
      setReports(Array.isArray(res) ? res : []);
    } catch (e) {
      console.error("Error loading reports", e);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const filteredReports = useMemo(() => {
    if (filterType === "all") return reports;
    return reports.filter((r) => r.type === filterType);
  }, [reports, filterType]);

  const handleDismiss = async (id: string) => {
    if (!window.confirm("Are you sure you want to dismiss this report?")) return;
    await dismissReport(id);
    loadReports();
  };

  const handleAction = async (report: Report) => {
    if (report.type === "user") {
      const confirmBan = window.confirm(`Ban user ${report.targetName}?`);
      if (confirmBan) {
        await banUser(report.targetId);
      }
    } else if (report.type === "facility") {
      const confirmDisable = window.confirm(`Disable facility ${report.targetName}?`);
      if (confirmDisable) {
        await disableFacility(report.targetId);
      }
    }
    await dismissReport(report._id); // mark report as resolved
    loadReports();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">User Reports</h1>

      <div className="flex gap-4 mb-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Reports</option>
          <option value="user">User Reports</option>
          <option value="facility">Facility Reports</option>
        </select>
        <button
          onClick={loadReports}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : filteredReports.length === 0 ? (
          <div className="p-4 text-gray-500">No reports found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Type</th>
                <th className="p-3">Target</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Reported By</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="p-3 capitalize">{r.type}</td>
                  <td className="p-3">{r.targetName}</td>
                  <td className="p-3">{r.reason}</td>
                  <td className="p-3">{r.submittedBy}</td>
                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleString("en-IN")}
                  </td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        r.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(r)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Take Action
                        </button>
                        <button
                          onClick={() => handleDismiss(r._id)}
                          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
