
import Notification from "../models/Notification.js";

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
