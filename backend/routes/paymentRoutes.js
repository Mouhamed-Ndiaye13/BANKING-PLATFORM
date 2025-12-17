// routes/paymentRoutes.js
import { Router } from "express";
import { makePayment, getPayments } from "../controllers/paymentController.js";

const router = Router();

// Endpoint pour effectuer un paiement
router.post("/", makePayment);

// Endpoint pour récupérer l'historique des paiements d'un compte
router.get("/:accountId", getPayments);

export default router;
