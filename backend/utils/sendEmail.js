
// MODE TEST : Email désactivé pour éviter les erreurs SMTP
const sendEmail = async ({ to, subject, html }) => {
  console.log("📩 Email désactivé temporairement.");
  console.log("➡️ Destinataire :", to);
  console.log("➡️ Sujet :", subject);
  return true;
};

module.exports = sendEmail;
