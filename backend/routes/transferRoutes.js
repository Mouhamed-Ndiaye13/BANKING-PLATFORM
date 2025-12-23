
// routes/transferRoutes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  internalTransfer,
  externalTransfer
} from "../controllers/transferController.js";

const router = Router();


/**
 * @swagger
 * /transfers/internal:
 *   post:
 *     summary: Effectuer un transfert interne entre les comptes de l'utilisateur
 *     tags: [Transferts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sourceAccount:
 *                 type: string
 *                 description: Compte source
 *               destinationAccount:
 *                 type: string
 *                 description: Compte destinataire
 *               amount:
 *                 type: number
 *                 description: Montant à transférer
 *             required:
 *               - sourceAccount
 *               - destinationAccount
 *               - amount
 *     responses:
 *       200:
 *         description: Transfert effectué avec succès
 *       400:
 *         description: Requête invalide ou fonds insuffisants
 *       401:
 *         description: Non autorisé
 */
router.post("/internal", auth, internalTransfer);

/**
 * @swagger
 * /transfers/external:
 *   post:
 *     summary: Effectuer un transfert externe vers un autre utilisateur ou banque
 *     tags: [Transferts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sourceAccount:
 *                 type: string
 *                 description: Compte source
 *               destinationAccount:
 *                 type: string
 *                 description: Compte destinataire externe
 *               amount:
 *                 type: number
 *                 description: Montant à transférer
 *               bankName:
 *                 type: string
 *                 description: Nom de la banque destinataire (pour externe)
 *             required:
 *               - sourceAccount
 *               - destinationAccount
 *               - amount
 *     responses:
 *       200:
 *         description: Transfert externe effectué avec succès
 *       400:
 *         description: Requête invalide ou fonds insuffisants
 *       401:
 *         description: Non autorisé
 */
router.post("/external", auth, externalTransfer);

export default router;
