// routes/paymentRoutes.js
import { Router } from "express";
import { makePayment, getPayments } from "../controllers/paymentController.js";

const router = Router();


/**
 * @swagger
 * /payments:
 *   post:
 *     summary: Effectuer un paiement
 *     tags: [Paiements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountId:
 *                 type: string
 *               amount:
 *                 type: number
 *             required:
 *               - accountId
 *               - amount
 *     responses:
 *       200:
 *         description: Paiement effectué avec succès
 *       400:
 *         description: Requête invalide
 */
router.post("/", makePayment);

/**
 * @swagger
 * /payments/{accountId}:
 *   get:
 *     summary: Récupérer l'historique des paiements d'un compte
 *     tags: [Paiements]
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du compte
 *     responses:
 *       200:
 *         description: Historique des paiements
 *       404:
 *         description: Compte non trouvé
 */
router.get("/:accountId", getPayments);

export default router;