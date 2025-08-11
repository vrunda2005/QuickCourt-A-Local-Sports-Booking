import axios from 'axios';
import { API_BASE } from '../utils/constants';

export const listFacilities = () => axios.get(`${API_BASE}/facilities`);
export const getFacility = (id: string) => axios.get(`${API_BASE}/facilities/${id}`);
export const myFacilities = (token: string) => axios.get(`${API_BASE}/facilities/mine`, { headers: { Authorization: `Bearer ${token}` } });



