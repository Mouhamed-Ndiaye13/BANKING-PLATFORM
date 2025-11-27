import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// TOKEN
export const setToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// USERS
export const getUsers = () => api.get("/users");
export const getUser = (id) => api.get(`/users/${id}`);
export const updateUser = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// ACCOUNTS (ajout obligatoire pour ton Dashboard)
// export const getAccounts = () => api.get("/accounts");

// TRANSACTIONS (optionnel)
export const getTransactions = () => api.get("/transactions");

// PAYMENTS
export const createPayment = (data) => api.post("/payments", data);
export const getPayments = () => api.get("/payments");

// Récupérer les comptes de l'utilisateur
export const getAccounts = (userId) => axios.get(`http://localhost:5000/api/accounts?user=${userId}`);

// Effectuer un paiement
export const makePayment = (data) => axios.post("http://localhost:5000/api/payments/pay", data);

export default api;
