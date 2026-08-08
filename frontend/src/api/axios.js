import axios from "axios";

// Pre-configured axios instance used across the whole app.
// `withCredentials: true` is essential -- it tells the browser to send
// the HTTP-only JWT cookie with every request, and to store any cookie
// that comes back from the server.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api;
