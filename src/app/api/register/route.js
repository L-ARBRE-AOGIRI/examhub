import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifierLimiteRequetes } from "@/lib/rateLimiter";
import { envoyerEmailBienvenue } from "@/lib/mailer";
import { FILIERES } from "@/lib/constantes";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "inconnu";
  const limite = verifierLimiteRequetes("register:" + ip, 5, 60 * 1000);
  if (!limite.autorise) {
    return Response.json({ erreur: "Trop de tentatives. Réessayez dans quelques instants" }, { status: 429 });
  }

  const body = await req.json();
  const nom = (body.nom || "").toString().trim();
  const email = (body.email || "").toString().trim().toLowerCase();
  const motDePasse = (body.motDePasse || "").toString();
  const filiere = (body.filiere || "").toString().trim();

  if (!nom || nom.length < 2 || nom.length > 100) {
    return Response.json({ erreur: "Le nom doit contenir entre 2 et 100 caractères" }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email) || email.length > 150) {
    return Response.json({ erreur: "Email invalide" }, { status: 400 });
  }
  if (motDePasse.length < 8 || motDePasse.length > 200) {
    return Response.json({ erreur: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
  }
  if (!FILIERES.includes(filiere)) {
    return Response.json({ erreur: "Choisissez votre filière dans la liste" }, { status: 400 });
  }

  const existant = await prisma.user.findUnique({ where: { email } });
  if (existant) {
    return Response.json({ erreur: "Impossible de créer ce compte. Vérifiez vos informations ou connectez-vous" }, { status: 400 });
  }

  const hash = await bcrypt.hash(motDePasse, 10);

  const user = await prisma.user.create({
    data: { nom, email, motDePasse: hash, filiere, statutCompte: "VALIDE" },
  });

  try {
    await envoyerEmailBienvenue(email, nom);
  } catch (err) {
    console.error("Erreur envoi email de bienvenue:", err.message);
  }

  return Response.json({ message: "Compte créé", userId: user.id });
}
