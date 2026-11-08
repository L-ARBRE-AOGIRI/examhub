export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getSessionActive();
  if (!session) {
    return Response.json({ erreur: "Non connecté" }, { status: 401 });
  }

  const epreuves = await prisma.epreuve.findMany({
    where: { auteurId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(epreuves);
}
