import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";
import { authOptions } from "@/lib/auth";

export async function POST(req, context) {
  const session = await getSessionActive();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return Response.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { id } = await context.params;
  const { statut, motifRejet } = await req.json();

  const epreuve = await prisma.epreuve.update({
    where: { id },
    data: {
      statut,
      motifRejet: statut === "REJETEE" ? (motifRejet || null) : null,
    },
  });

  return Response.json({ message: "Épreuve traitée", epreuve });
}
