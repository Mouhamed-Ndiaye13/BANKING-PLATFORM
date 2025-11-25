// src/services/mockApi.js
export const mockUsers = [
  { _id: "1", name: "Admin", email: "admin@local", role: "admin" },
  { _id: "2", name: "User1", email: "user1@local", role: "user" },
  { _id: "3", name: "User2", email: "user2@local", role: "user" },
];

export const mockAccounts = [
  { type: "Courant", balance: 5200 },
  { type: "Épargne", balance: 12450 },
];

export const mockTransactions = [
  { id: 1, label: "Paiement Facture EDF", amount: -120 },
  { id: 2, label: "Virement Reçu", amount: 500 },
  { id: 3, label: "Achat Amazon", amount: -60 },
];

export const getUsers = () =>
  new Promise((resolve) => setTimeout(() => resolve(mockUsers), 500));

export const getAccounts = () =>
  new Promise((resolve) => setTimeout(() => resolve(mockAccounts), 500));

export const getTransactions = () =>
  new Promise((resolve) => setTimeout(() => resolve(mockTransactions), 500));
