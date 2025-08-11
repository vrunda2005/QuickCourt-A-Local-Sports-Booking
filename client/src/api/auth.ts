// src/api/auth.ts
import axios from "axios";

export async function login(email: string, password: string) {
  // example: POST /api/login returns { token, user: { email, role } }
  const res = await axios.post("/api/login", { email, password });
  return res.data; // { token, user }
}
