import admin from "firebase-admin";

// Remplace les \n par de vrais retours à la ligne
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

// Vérification des variables
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
  throw new Error("Les variables d'environnement Firebase ne sont pas définies !");
}

// Initialisation sécurisée
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

export const auth = admin.auth();
export const db = admin.firestore();
export default admin;
