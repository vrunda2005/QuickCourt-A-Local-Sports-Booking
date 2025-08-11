// src/api/admin.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL as string || "",
  headers: { "Content-Type": "application/json" },
});

// attach token from localStorage (or replace with your auth context)
api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("admin_token");
  if (token) cfg.headers = { ...(cfg.headers || {}), Authorization: `Bearer ${token}` };
  return cfg;
});

// Types
export type OverviewResponse = {
  totalUsers: number;
  totalOwners: number;
  totalBookings: number;
  totalActiveCourts: number;
};

export type TimePoint = { date: string; count: number };
export type ChartResponse = { period?: number; data: TimePoint[] };

// API calls
export const getOverview = async (): Promise<OverviewResponse> => {
  const r = await api.get("/admin/stats/overview");
  return r.data;
};

export const getBookingsActivity = async (period = 30): Promise<ChartResponse> => {
  const r = await api.get(`/admin/stats/bookings-activity?period=${period}`);
  return r.data;
};

export const getUserRegistrations = async (period = 30): Promise<ChartResponse> => {
  const r = await api.get(`/admin/stats/user-registrations?period=${period}`);
  return r.data;
};

export const getApprovalTrend = async (period = 30): Promise<ChartResponse> => {
  const r = await api.get(`/admin/stats/facility-approvals?period=${period}`);
  return r.data;
};

export const getActiveSports = async (limit = 5) => {
  const r = await api.get(`/admin/stats/most-active-sports?limit=${limit}`);
  return r.data;
};

// Facility-related endpoints
export type Facility = {
  _id: string;
  name: string;
  ownerName: string;
  status: "pending" | "approved" | "rejected";
  photos: string[];
  description: string;
  location: string;
  submittedAt: string;
};

export const getPendingFacilities = async (): Promise<Facility[]> => {
  const r = await api.get("/admin/facilities/pending");
  return r.data;
};

export const approveFacility = async (id: string, comments?: string) => {
  const r = await api.post(`/admin/facilities/${id}/approve`, { comments });
  return r.data;
};

export const rejectFacility = async (id: string, comments?: string) => {
  const r = await api.post(`/admin/facilities/${id}/reject`, { comments });
  return r.data;
};



export default api;