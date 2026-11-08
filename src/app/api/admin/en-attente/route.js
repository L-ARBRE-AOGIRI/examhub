export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getSessionActive();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return Response.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const epreuves = await prisma.epreuve.findMany({
    where: { statut: "EN_ATTENTE" },
    include: { auteur: { select: { nom: true, email: true, filiere: true } } },
    orderBy: { createdAt: "asc" },
  });

  const utilisateurs = await prisma.user.findMany({
    where: { statutCompte: "EN_ATTENTE" },
    select: { id: true, nom: true, email: true, filiere: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  return Response.json({ epreuves, utilisateurs });
}
