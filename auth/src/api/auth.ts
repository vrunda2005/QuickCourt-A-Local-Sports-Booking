import axios from 'axios';
import { API_BASE } from '../utils/constants';

export const promoteToAdmin = (secret: string, token: string) => axios.post(`${API_BASE}/admin/promote`, { secret }, { headers: { Authorization: `Bearer ${token}` } });



