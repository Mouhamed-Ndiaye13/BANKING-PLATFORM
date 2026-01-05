// services/api.js
import axios from "axios";

const API_BASE = "https://banking-backend-rtsx.onrender.com/admin";

export const api = async (method, endpoint, data = null) => {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await axios({
      method,
      url: `${API_BASE}${endpoint}`,
      data,
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
    return res.data;
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
