export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";

// Renvoie la liste des identifiants des documents mis en favori par l'utilisateur.
export async function GET() {
  const session = await getSessionActive();
  if (!session) {
    return Response.json([]);
  }

  const favoris = await prisma.favori.findMany({
    where: { userId: session.user.id },
    select: { epreuveId: true },
  });

  return Response.json(favoris.map((f) => f.epreuveId));
}
