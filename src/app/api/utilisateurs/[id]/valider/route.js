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

  if (statut === "BLOQUE" && session.user.role !== "SUPER_ADMIN") {
    return Response.json({ erreur: "Seul un super admin peut bloquer un compte" }, { status: 403 });
  }

  const user = await prisma.user.update({
    where: { id },
    data: {
      statutCompte: statut,
      motifRejet: statut === "REJETE" ? (motifRejet || null) : null,
    },
  });

  return Response.json({ message: "Compte mis à jour" });
}
