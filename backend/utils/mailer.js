import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 

// Création d’un seul transporteur global
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail
    pass: process.env.EMAIL_PASS, // App Password
  },
});

// Fonction d’envoi d’email
export const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: `"BankReemi" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email envoyé à ${to}`);
  } catch (err) {
    console.error("Erreur envoi email :", err);
    throw err;
  }
};

// Vérification facultative (local uniquement)
if (process.env.NODE_ENV !== "production") {
  transporter.verify((error, success) => {
    if (error) console.log("Erreur transporteur Nodemailer :", error);
    else console.log("Nodemailer prêt à envoyer des emails !");
  });
}

export default transporter;
