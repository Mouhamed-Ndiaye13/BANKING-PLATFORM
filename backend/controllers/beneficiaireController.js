import Beneficiaire from "../models/Beneficiaire.js";

// Récupérer tous les bénéficiaires pour un compte
export const getBeneficiaires = async (req, res) => {
  const { accountId } = req.params;
  try {
    const beneficiaries = await Beneficiaire.find({ accountId });
    res.json(beneficiaries);
  } catch (err) {
    res.status(500).json({ error: "Erreur récupération bénéficiaires" });
  }
};

// Ajouter un nouveau bénéficiaire

export const addBeneficiaire = async (req, res) => {
  try {
    const { accountId, nom, type } = req.body;
    if (!accountId || !nom || !type) {
      return res.status(400).json({ error: "Tous les champs sont obligatoires" });
    }

    const newB = await Beneficiaire.create({ accountId, nom, type });
    res.status(201).json(newB);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};
