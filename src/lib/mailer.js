import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function echapper(texte) {
  return String(texte).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export async function envoyerEmailBienvenue(destinataire, nom) {
  await transporter.sendMail({
    from: `"ExamHECM" <${process.env.EMAIL_USER}>`,
    to: destinataire,
    subject: "Bienvenue sur ExamHECM !",
    html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h1 style="color: #008843;">Bienvenue, ${echapper(nom)} !</h1>
      <p>Votre compte ExamHECM a bien été créé.</p>
      <p>Vous pouvez dès maintenant consulter et télécharger les épreuves de votre filière. Si vous le souhaitez, vous pouvez aussi partager vos propres épreuves pour aider les autres étudiants.</p>
      <p style="margin-top: 24px;"><a href="${process.env.NEXTAUTH_URL}/epreuves" style="background: #008843; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Voir les épreuves</a></p>
      <p style="color: #888; font-size: 13px; margin-top: 32px;">ExamHECM — Épreuves, cours, concours et examens des étudiants de HECM.</p>
    </div>`,
  });
}

export async function envoyerEmailReinitialisation(destinataire, lienReinitialisation) {
  await transporter.sendMail({
    from: `"ExamHECM" <${process.env.EMAIL_USER}>`,
    to: destinataire,
    subject: "Réinitialisation de votre mot de passe ExamHECM",
    html: `<div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h1 style="color: #008843;">Réinitialisation du mot de passe</h1>
      <p>Vous avez demandé à réinitialiser votre mot de passe sur ExamHECM.</p>
      <p style="margin-top: 24px;"><a href="${lienReinitialisation}" style="background: #008843; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block;">Choisir un nouveau mot de passe</a></p>
      <p style="color: #888; font-size: 13px; margin-top: 16px;">Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
    </div>`,
  });
}
