// src/services/api.js
import axios from "axios";

const BASE_URL = "https://banking-backend-rtsx.onrender.com"; // backend

export const api = async (method, endpoint, data = null) => {
  try {
    const token = localStorage.getItem("adminToken"); // récupère le token admin

    const res = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "", // ✅ token obligatoire
      },
    });

    return res.data;
  } catch (err) {
    console.error("API ERROR:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
