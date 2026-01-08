import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const msg = {
      to,
      from: process.env.EMAIL_FROM,
      subject,
      text,
      html,
    };
    await sgMail.send(msg);
    console.log("Email envoyé à", to);
  } catch (error) {
    console.error("Erreur envoi email :", error);
    if (error.response) {
      console.error(error.response.body);
    }
  }
};
