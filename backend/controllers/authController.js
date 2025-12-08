// controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

// Enregistrer un nouvel utilisateur
export const register = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ message: "User registered", user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Connexion
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in",
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
