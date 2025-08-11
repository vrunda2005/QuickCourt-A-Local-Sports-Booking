import axios from 'axios';
import { API_BASE } from '../utils/constants';

export const getMyBookings = (token: string) => axios.get(`${API_BASE}/bookings/me`, { headers: { Authorization: `Bearer ${token}` } });
export const cancelBooking = (id: string, token: string) => axios.delete(`${API_BASE}/bookings/${id}`, { headers: { Authorization: `Bearer ${token}` } });



