import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/Layouts/AdminLayout";
import { getAllUsers, banUser, unbanUser, getUserBookings, type AdminUser } from "../../api/admin";

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [historyUserId, setHistoryUserId] = useState<string | null>(null);
  const [history, setHistory] = useState<Array<{ _id: string; date: string; slot: string; price: number; status: string }> | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // normalize various API shapes into an array
  const normalizeToArray = <T,>(v: any): T[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (Array.isArray(v.data)) return v.data;
    if (Array.isArray(v.users)) return v.users;
    if (Array.isArray(v.items)) return v.items;
    return [];
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        // debug: uncomment if you need to inspect the shape
        // console.log("getAllUsers result:", data);
        setUsers(normalizeToArray<AdminUser>(data));
      } catch (_) {
        setUsers([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const safeArray = <T,>(v: any): T[] => Array.isArray(v) ? v : [];

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return safeArray<AdminUser>(users).filter(u => {
      const matchesSearch =
        (u.fullName ?? "").toLowerCase().includes(q) ||
        (u.email ?? "").toLowerCase().includes(q);
      const matchesRole = filterRole === "all" || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, search, filterRole]);

  const toggleBan = async (user: AdminUser) => {
    try {
      if (user.isBanned) {
        await unbanUser(user._id);
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBanned: false } : u));
      } else {
        await banUser(user._id);
        setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBanned: true } : u));
      }
    } catch (e) {
      // optional: console.error("toggleBan error", e);
    }
  };

  const openHistory = async (user: AdminUser) => {
    setHistoryUserId(user._id);
    setHistoryLoading(true);
    try {
      const data = await getUserBookings(user._id);
      setHistory(normalizeToArray(data));
    } catch (_) {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-3 py-2 flex-1"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="owner">Facility Owner</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-4">Loading…</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id} className="border-b">
                  <td className="p-3">{user.fullName}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 capitalize">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        !user.isBanned ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isBanned ? "banned" : "active"}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => toggleBan(user)}
                      className={`px-3 py-1 rounded ${
                        !user.isBanned ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                    >
                      {!user.isBanned ? "Ban" : "Unban"}
                    </button>
                    <button
                      onClick={() => openHistory(user)}
                      className="ml-2 px-3 py-1 rounded border"
                    >
                      View History
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {historyUserId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Booking History</h3>
              <button className="px-3 py-1 border rounded" onClick={() => { setHistoryUserId(null); setHistory(null); }}>Close</button>
            </div>
            {historyLoading ? (
              <div>Loading…</div>
            ) : !history || history.length === 0 ? (
              <div className="text-gray-500">No bookings found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Date</th>
                      <th className="p-2">Slot</th>
                      <th className="p-2">Price</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(h => (
                      <tr key={h._id} className="border-b">
                        <td className="p-2">{new Date(h.date).toLocaleString()}</td>
                        <td className="p-2">{h.slot}</td>
                        <td className="p-2">₹{h.price}</td>
                        <td className="p-2 capitalize">{h.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
