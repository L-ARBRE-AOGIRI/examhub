import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const body = await req.json();
  const token = (body.token || "").toString();
  const motDePasse = (body.motDePasse || "").toString();

  if (motDePasse.length < 8 || motDePasse.length > 200) {
    return Response.json({ erreur: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      tokenReset: token,
      tokenResetExpire: { gt: new Date() },
    },
  });

  if (!user) {
    return Response.json({ erreur: "Lien invalide ou expiré. Refaites une demande" }, { status: 400 });
  }

  const hash = await bcrypt.hash(motDePasse, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { motDePasse: hash, tokenReset: null, tokenResetExpire: null },
  });

  return Response.json({ message: "Mot de passe mis à jour" });
}
