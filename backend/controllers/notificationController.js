<<<<<<< HEAD:backend/controllers/notificationControllers.js
// import Notification from "../models/Notification.js";

// // Récupérer toutes les notifications d'un utilisateur
// export const getNotifications = async (req, res) => {
//   try {
//     const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Créer notification (utilisé par paiement, virement, transaction)
// export const createNotification = async ({ userId, type, message }) => {
//   try {
//     const notification = new Notification({ userId, type, message });
//     await notification.save();
//     return notification;
//   } catch (err) {
//     console.error("Notification error:", err.message);
//   }
// };


// // Marquer comme lue
// export const markAsRead = async (req, res) => {
//   try {
//     const notification = await Notification.findByIdAndUpdate(
//       req.params.id,
//       { read: true },
//       { new: true }
//     );
//     res.json(notification);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
import Notification from "../models/Notification.js";
=======
import Notification from "../models/notification.js";
>>>>>>> 698d0077a1545ad5acad5a4cf8e0c1d204456a88:backend/controllers/notificationController.js

/**
 * Récupérer toutes les notifications de l'utilisateur connecté
 */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération notifications" });
  }
};

/**
 * Créer une notification (utilisée par transfert, paiement, etc.)
 *  Fonction interne (PAS une route)
 */
export const createNotification = async ({ userId, type, message }) => {
  try {
    if (!userId || !type || !message) {
      throw new Error("Paramètres notification manquants");
    }

    const notification = new Notification({
      userId,
      type,
      message,
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error(" Notification error:", error.message);
    throw error;
  }
};

/**
 * Marquer une notification comme lue
 */
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification introuvable" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour notification" });
  }
};
