

import Support from '../models/Support.js';

import mongoose from "mongoose";

export const create = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const ticket = new Support({
      user: new mongoose.Types.ObjectId(req.user.id),
      subject,
      message
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


export const list = async (req, res) => {
  try {
    //  vérifier rôle admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Accès refusé" });
    }

    const tickets = await Support.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const get = async (req, res) => {
  try {
    const ticket = await Support.findById(req.params.id)
      .populate('user', 'name email');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket non trouvé' });
    }

    if (
      ticket.user._id.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: "Accès refusé" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Admin uniquement" });
    }

    const { status } = req.body;

    if (!['ouvert', 'fermé'].includes(status)) {
      return res.status(400).json({ message: "Statut invalide" });
    }

    const ticket = await Support.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket non trouvé" });
    }

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






















// // Lister tous les tickets (admin)
// export const list = async (req, res) => {
//   try {
//     const tickets = await Support.find().populate('user', 'name email').sort({ createdAt: -1 });
//     res.json(tickets);
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur: ' + err.message });
//   }
// };

// // Récupérer un ticket spécifique
// export const get = async (req, res) => {
//   try {
//     const ticket = await Support.findById(req.params.id).populate('user', 'name email');
//     if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });
//     res.json(ticket);
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur serveur: ' + err.message });
//   }
// };

// // Créer un ticket
// export const create = async (req, res) => {
//   try {
//     const ticket = new Support(req.body);
//     await ticket.save();
//     res.status(201).json({ message: 'Ticket créé avec succès', ticket });
//   } catch (err) {
//     res.status(400).json({ message: 'Impossible de créer le ticket: ' + err.message });
//   }
// };

// // Mettre à jour un ticket
// export const update = async (req, res) => {
//   try {
//     const ticket = await Support.findById(req.params.id);
//     if (!ticket) return res.status(404).json({ message: 'Ticket non trouvé' });

//     // Mettre à jour seulement les champs fournis
//     Object.keys(req.body).forEach(key => {
//       ticket[key] = req.body[key];
//     });

//     await ticket.save();
//     res.json({ message: 'Ticket mis à jour', ticket });
//   } catch (err) {
//     res.status(400).json({ message: 'Impossible de mettre à jour le ticket: ' + err.message });
//   }
// };
