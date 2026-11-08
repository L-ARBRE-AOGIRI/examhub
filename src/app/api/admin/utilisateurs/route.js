export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getSessionActive();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return Response.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const utilisateurs = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      nom: true,
      email: true,
      role: true,
      statutCompte: true,
      filiere: true,
      createdAt: true,
      epreuves: { select: { id: true } },
    },
  });

  return Response.json(utilisateurs);
}
