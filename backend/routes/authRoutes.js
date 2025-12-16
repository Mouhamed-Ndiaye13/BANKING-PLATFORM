
import express from "express";

const router = express.Router();
import {
  register,
  login,
  forgotPassword,
  resetPassword
} from "../controllers/authController.js";



router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
