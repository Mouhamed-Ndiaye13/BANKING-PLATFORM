import Beneficiaire from "../models/Beneficiaire.js";

// GET /api/beneficiaires
export const getBeneficiaires = async (req, res) => {
  try {
    const userId = req.user.id; // assure-toi que c'est bien userId

    const beneficiaires = await Beneficiaire.find({
      userId,           // <--- corrigé (avant tu avais user)
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
    const userId = req.user.id;
    const { nom, service, reference } = req.body;

    if (!nom || !service || !reference) {
      return res.status(400).json({
        error: "Nom, service et référence sont obligatoires"
      });
    }

    // Vérifie si le bénéficiaire existe déjà pour cet utilisateur
    const exists = await Beneficiaire.findOne({
      userId,       // <--- corrigé
      service,
      reference
    });

    if (exists) {
      return res.status(409).json({
        error: "Ce bénéficiaire existe déjà"
      });
    }

    const newBeneficiaire = await Beneficiaire.create({
      userId,                     // <--- obligatoire
      nom,
      type: "service_payment",    // <-- définit toujours type
      service,
      reference,
    });

    res.status(201).json(newBeneficiaire);

  } catch (err) {
    console.error("ADD BENEFICIAIRE ERROR:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};



