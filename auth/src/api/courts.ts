import axios from 'axios';
import { API_BASE } from '../utils/constants';

export const listCourts = (facilityId: string, token: string) => axios.get(`${API_BASE}/courts?facility=${facilityId}`, { headers: { Authorization: `Bearer ${token}` } });
export const addCourt = (payload: any, token: string) => axios.post(`${API_BASE}/courts`, payload, { headers: { Authorization: `Bearer ${token}` } });
export const deleteCourt = (id: string, token: string) => axios.delete(`${API_BASE}/courts/${id}`, { headers: { Authorization: `Bearer ${token}` } });



