
// routes/transferRoutes.js
import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  internalTransfer,
  externalTransfer
} from "../controllers/transferController.js";

const router = Router();

// Internal transfer
router.post("/internal", auth, internalTransfer);

// External transfer
router.post("/external", auth, externalTransfer);

export default router;