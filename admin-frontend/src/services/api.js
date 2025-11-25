import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const setToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Users
export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);

// Accounts
export const getAccounts = () => api.get("/accounts");

// Transactions
export const getTransactions = () => api.get("/transactions");

// Payments
export const getPayments = () => api.get("/payments");

export default api;
