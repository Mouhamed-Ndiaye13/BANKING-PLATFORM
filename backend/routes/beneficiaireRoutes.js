import { Router } from "express";
import { getBeneficiaires, addBeneficiaire } from "../controllers/beneficiaireController.js";

const router = Router();

// GET /api/beneficiaires/:accountId
router.get("/:accountId", getBeneficiaires);

// POST /api/beneficiaires
router.post("/", addBeneficiaire);

export default router;
