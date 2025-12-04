// api.js
import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const setToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// USERS
export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ACCOUNTS
export const getAccounts = () => api.get("/accounts");  // <- ajoute ceci

export default api;
