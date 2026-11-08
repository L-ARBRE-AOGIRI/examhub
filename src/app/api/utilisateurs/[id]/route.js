import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";
import { authOptions } from "@/lib/auth";

export async function DELETE(req, context) {
  const session = await getSessionActive();
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return Response.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { id } = await context.params;

  if (id === session.user.id) {
    return Response.json({ erreur: "Vous ne pouvez pas supprimer votre propre compte" }, { status: 400 });
  }

  await prisma.epreuve.deleteMany({ where: { auteurId: id } });
  await prisma.user.delete({ where: { id } });

  return Response.json({ message: "Utilisateur supprimé" });
}
