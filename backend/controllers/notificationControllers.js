import Notification from '../models/notification.js';

// Lister toutes les notifications d'un utilisateur
export const list = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};

// Marquer une notification comme lue
export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification non trouvée' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};

// Créer une notification
export const create = async (req, res) => {
  try {
    const notification = new Notification({
      user: req.body.user,
      message: req.body.message
    });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur: ' + err.message });
  }
};
