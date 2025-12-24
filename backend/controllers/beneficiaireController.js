import Beneficiaire from "../models/Beneficiaire.js";

// GET /api/beneficiaires
export const getBeneficiaires = async (req, res) => {
  try {
    const userId = req.user._id; 

    const beneficiaires = await Beneficiaire.find({
      user: userId,
      type: "service_payment",
    }).sort({ createdAt: -1 });

    res.json(beneficiaires);
  } catch (err) {
    console.error("GET BENEFICIAIRES ERROR:", err);
    res.status(500).json({ error: "Erreur récupération bénéficiaires" });
  }
};

// POST /api/beneficiaires
export const addBeneficiaire = async (req, res) => {
  try {
    const userId = req.user._id; // récupéré via le middleware auth
    const { nom, service, reference } = req.body;

    if (!nom || !service) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    const newBeneficiaire = await Beneficiaire.create({
      user: userId, // <-- indispensable !
      nom,
      type: "service_payment",
      service,
      reference,
    });

    res.status(201).json(newBeneficiaire);
  } catch (err) {
    console.error("ADD BENEFICIAIRE ERROR:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

