import admin from "firebase-admin";

if (!process.env.FIREBASE_ADMIN_JSON) {
  throw new Error("La variable d'environnement FIREBASE_ADMIN_JSON n'est pas définie !");
}

// Parse JSON de la variable d'environnement
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON);

// Assurez-vous que la clé privée a bien les \n échappés
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
