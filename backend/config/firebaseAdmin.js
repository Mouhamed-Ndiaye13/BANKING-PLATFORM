import admin from "firebase-admin";

// 🔹 Utilisation de la variable d'environnement FIREBASE_ADMIN_JSON
if (!admin.apps.length) {
  if (!process.env.FIREBASE_ADMIN_JSON) {
    throw new Error(
      "La variable d'environnement FIREBASE_ADMIN_JSON n'est pas définie !"
    );
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_JSON);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;
