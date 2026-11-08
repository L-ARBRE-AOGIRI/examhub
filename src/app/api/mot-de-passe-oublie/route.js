import { prisma } from "@/lib/prisma";
import { envoyerEmailReinitialisation } from "@/lib/mailer";
import { verifierLimiteRequetes } from "@/lib/rateLimiter";
import crypto from "crypto";

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || "inconnu";
  const limite = verifierLimiteRequetes("reset:" + ip, 3, 60 * 1000);
  if (!limite.autorise) {
    return Response.json({ erreur: "Trop de tentatives. Réessayez dans quelques instants" }, { status: 429 });
  }

  const body = await req.json();
  const email = (body.email || "").toString().trim().toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiration = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await prisma.user.update({
      where: { id: user.id },
      data: { tokenReset: token, tokenResetExpire: expiration },
    });

    const lien = process.env.NEXTAUTH_URL + "/reinitialiser-mot-de-passe?token=" + token;

    try {
      await envoyerEmailReinitialisation(email, lien);
    } catch (err) {
      console.error("Erreur envoi email de reinitialisation:", err.message);
    }
  }

  // Meme reponse que l email existe ou non, pour ne pas reveler quels emails sont inscrits
  return Response.json({ message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé" });
}
