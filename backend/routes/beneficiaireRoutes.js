import express from "express";
import { getBeneficiaires, addBeneficiaire} from "../controllers/beneficiaireController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// ---------------- ROUTES BÉNÉFICIAIRES ----------------

// GET /api/beneficiaires
router.get("/", auth, getBeneficiaires);

// POST /api/beneficiaires
router.post("/", auth, addBeneficiaire);


export default router;
