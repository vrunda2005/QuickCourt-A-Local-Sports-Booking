import React from "react";
import { Link } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <Link to="/admin/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/admin/facility-approval" className="hover:underline">Facility Approvals</Link>
          <Link to="/admin/users" className="hover:underline">User Management</Link>
          <Link to="/admin/reports" className="hover:underline">Reports & Moderation</Link>
          <Link to="/admin/profile" className="hover:underline">Profile</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
