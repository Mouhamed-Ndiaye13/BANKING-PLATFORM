// import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Vérification de la connexion
transporter.verify((error, success) => {
  if (error) {
    console.log("Erreur transporteur Nodemailer :", error);
  } else {
    console.log("Nodemailer prêt à envoyer des emails !");
  }
});

export default transporter;
