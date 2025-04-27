import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_API || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;