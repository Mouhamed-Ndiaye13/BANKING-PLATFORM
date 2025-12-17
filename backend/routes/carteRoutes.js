import express from "express";
import auth from "../middleware/auth.js";
import { createCard, setPin, activateCard } from "../controllers/carteController.js";

const router = express.Router();

// Créer une carte
router.post("/create", auth, createCard);

// Définir le PIN
router.post("/:id/set-pin", auth, setPin);

// Activer la carte
router.post("/:id/activate", auth, activateCard);
 
export default router;
