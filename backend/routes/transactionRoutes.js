
import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  getTransactions,
  getTransactionById
} from "../controllers/transactionController.js";

const router = Router();



/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Récupérer toutes les transactions de l'utilisateur connecté
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   accountId:
 *                     type: string
 *                   amount:
 *                     type: number
 *                   type:
 *                     type: string
 *                     description: "deposit, withdrawal, transfer, etc."
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Non autorisé
 */
router.get("/", auth, getTransactions);

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Récupérer une transaction par son ID
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la transaction
 *     responses:
 *       200:
 *         description: Détails de la transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 accountId:
 *                   type: string
 *                 amount:
 *                   type: number
 *                 type:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Transaction non trouvée
 */
router.get("/:id", auth, getTransactionById);

export default router;


