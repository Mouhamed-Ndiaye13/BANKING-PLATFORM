import express from "express";
import auth from "../middleware/auth.js";
import { getContacts, createContact } from "../controllers/contactController.js";

const router = express.Router();

router.get("/", auth, getContacts);
router.post("/", auth, createContact);

export default router;
