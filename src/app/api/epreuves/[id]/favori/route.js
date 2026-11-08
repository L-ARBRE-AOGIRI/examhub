export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";

// Ajoute ou retire le document des favoris de l'utilisateur connecte.
export async function POST(req, context) {
  const session = await getSessionActive();
  if (!session) {
    return Response.json({ erreur: "Connectez-vous pour ajouter des favoris" }, { status: 401 });
  }

  const { id } = await context.params;
  const cle = { userId_epreuveId: { userId: session.user.id, epreuveId: id } };

  const existant = await prisma.favori.findUnique({ where: cle });
  if (existant) {
    await prisma.favori.delete({ where: cle });
    return Response.json({ favori: false });
  }

  const epreuve = await prisma.epreuve.findUnique({ where: { id }, select: { statut: true } });
  if (!epreuve || epreuve.statut !== "VALIDEE") {
    return Response.json({ erreur: "Document introuvable" }, { status: 404 });
  }

  await prisma.favori.create({ data: { userId: session.user.id, epreuveId: id } });
  return Response.json({ favori: true });
}
