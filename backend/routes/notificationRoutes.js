import express from "express";
import { getNotifications, markAsRead } from "../controllers/notificationControllers.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();



/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Récupérer toutes les notifications de l'utilisateur connecté
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   message:
 *                     type: string
 *                   read:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non autorisé
 */
router.get("/", verifyToken, getNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Marquer une notification comme lue
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la notification à marquer comme lue
 *     responses:
 *       200:
 *         description: Notification marquée comme lue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 read:
 *                   type: boolean
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Notification non trouvée
 */
router.patch("/:id/read", verifyToken, markAsRead)

export default router;
