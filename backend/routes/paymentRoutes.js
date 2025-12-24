// routes/paymentRoutes.js
import { Router } from "express";
import {payCard,
  makePayment,
  getPayments} from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";
const router = Router();


// Paiement par carte
router.post("/card", auth, payCard);
// pour effectuer un paiement
router.post("/service",auth, makePayment);

// pour récupérer l'historique des paiements d'un compte
router.get("/",auth,getPayments);

export default router;
