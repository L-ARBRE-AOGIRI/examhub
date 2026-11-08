export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";

export async function GET(req, context) {
  const { id } = await context.params;
  const session = await getSessionActive();

  if (!session) {
    return Response.redirect(new URL("/connexion", req.url), 302);
  }

  const epreuve = await prisma.epreuve.findUnique({
    where: { id },
    select: { statut: true, fichierUrl: true, auteurId: true },
  });

  const estAdmin = session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";
  const autorise = epreuve && (epreuve.statut === "VALIDEE" || estAdmin || epreuve.auteurId === session.user.id);
  if (!autorise) {
    return Response.json({ erreur: "Document introuvable" }, { status: 404 });
  }

  if (epreuve.statut === "VALIDEE") {
    await prisma.epreuve.update({
      where: { id },
      data: { telechargements: { increment: 1 } },
    });
  }

  return Response.redirect(epreuve.fichierUrl, 302);
}
