exports.getCategories = async (req, res) => {
  try {
    const categories = [
  { "id": "1", "name": "Alimentation", "icon": "fa-solid fa-basket-shopping" },
  { "id": "2", "name": "Transport", "icon": "fa-solid fa-bus" },
  { "id": "3", "name": "Loisirs", "icon": "fa-solid fa-film" },
  { "id": "4", "name": "Facture", "icon": "fa-solid fa-file-invoice-dollar" },
  { "id": "5", "name": "Revenus", "icon": "fa-solid fa-wallet" },
  { "id": "6", "name": "Santé", "icon": "fa-solid fa-hospital" },
  { "id": "7", "name": "Shopping", "icon": "fa-solid fa-shopping-bag" }
]

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};
