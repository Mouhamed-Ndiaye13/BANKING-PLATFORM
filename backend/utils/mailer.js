import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); 
//creation de transporteur
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
// ENVOYER email de confirmation de inscription 
 export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"BankReemi" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// Vérification de la connexion
transporter.verify((error, success) => {
  if (error) {
    console.log("Erreur transporteur Nodemailer :", error);
  } else {
    console.log("Nodemailer prêt à envoyer des emails !");
  }
});

export default transporter;
