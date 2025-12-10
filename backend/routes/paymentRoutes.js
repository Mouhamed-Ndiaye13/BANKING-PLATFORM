import express from "express";
import { payCard } from "../controllers/paymentController.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.post("/pay", auth, payCard);

export default router;


