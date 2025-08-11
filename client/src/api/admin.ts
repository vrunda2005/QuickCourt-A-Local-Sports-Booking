// src/api/admin.ts
import api from "./axiosConfig";

export type OverviewResponse = {
  totalUsers: number;
  totalOwners: number;
  totalBookings: number;
  totalActiveCourts: number;
};

export type TimePoint = { date: string; count: number };
export type ChartResponse = { period?: number; data: TimePoint[] };

export type Facility = {
  _id: string;
  ownerId: string;
  name: string;
  status: "pending" | "approved" | "rejected";
  photos: string[];
  description?: string;
  location: string;
  sports?: string[];
  createdAt: string;
  updatedAt: string;
};

// Stats
export const getAdminProfile = async () => {
  return (await api.get("/admin/profile")).data;
};
export const getAdminStats = async () => {
  return (await api.get("/admin/stats")).data;
};
export const getAdminRecentActions = async () => {
  return (await api.get("/admin/recent-actions")).data;
};

export const getReports = async () => {
  return (await api.get("/admin/reports")).data;
};
export const dismissReport = async (id: string) => {
  return (await api.post(`/admin/reports/${id}/dismiss`)).data;
};
export const disableFacility = async (id: string) => {
  return (await api.post(`/admin/facilities/${id}/disable`)).data;
};
export const enableFacility = async (id: string) => {
  return (await api.post(`/admin/facilities/${id}/enable`)).data;
};

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

export const getEarningsSimulation = async () => {
  const r = await api.get(`/admin/stats/earnings-simulation`);
  return r.data as { month: string; earnings: number }[];
};

// Facilities
export const getPendingFacilities = async (): Promise<Facility[]> => {
  const r = await api.get("/admin/facilities/pending");
  return r.data;
};
export const approveFacility = async (id: string, comments?: string) => {
  const r = await api.put(`/admin/facility/${id}/approve`, { comments });
  return r.data;
};
export const rejectFacility = async (id: string, comments?: string) => {
  const r = await api.put(`/admin/facility/${id}/reject`, { comments });
  return r.data;
};

// Users
export type AdminUser = {
  _id: string;
  fullName: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  isBanned: boolean;
};
export const getAllUsers = async (): Promise<AdminUser[]> => {
  const r = await api.get('/admin/users');
  return r.data;
};
export const banUser = async (id: string) => {
  const r = await api.put(`/admin/user/${id}/ban`);
  return r.data;
};
export const unbanUser = async (id: string) => {
  const r = await api.put(`/admin/user/${id}/unban`);
  return r.data;
};

export const getUserBookings = async (id: string) => {
  const r = await api.get(`/admin/user/${id}/bookings`);
  return r.data as Array<{ _id: string; date: string; slot: string; price: number; status: string }>;
};

export default api;