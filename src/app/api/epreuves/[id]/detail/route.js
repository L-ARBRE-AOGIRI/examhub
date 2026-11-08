import { prisma } from "@/lib/prisma";
import { versionPublique } from "@/lib/epreuves";

export async function GET(req, context) {
  const { id } = await context.params;

  const epreuve = await prisma.epreuve.findUnique({
    where: { id },
    include: { auteur: { select: { nom: true } } },
  });

  if (!epreuve || epreuve.statut !== "VALIDEE") {
    return Response.json({ erreur: "Épreuve introuvable" }, { status: 404 });
  }

  const similaires = await prisma.epreuve.findMany({
    where: {
      statut: "VALIDEE",
      niveau: epreuve.niveau,
      matiere: epreuve.matiere,
      id: { not: epreuve.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return Response.json({
    epreuve: versionPublique(epreuve),
    similaires: similaires.map(versionPublique),
  });
}
