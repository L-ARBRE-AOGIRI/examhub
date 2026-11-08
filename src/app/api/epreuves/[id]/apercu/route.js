import { prisma } from "@/lib/prisma";
import { urlApercu } from "@/lib/epreuves";

export async function GET(req, context) {
  const { id } = await context.params;

  const epreuve = await prisma.epreuve.findUnique({
    where: { id },
    select: { statut: true, apercuId: true },
  });

  if (!epreuve || epreuve.statut !== "VALIDEE" || !epreuve.apercuId) {
    return Response.json({ erreur: "Aperçu indisponible" }, { status: 404 });
  }

  // L'image est recuperee par le serveur : le navigateur ne voit jamais l'adresse Cloudinary.
  const res = await fetch(urlApercu(epreuve.apercuId));
  if (!res.ok) {
    return Response.json({ erreur: "Aperçu indisponible" }, { status: 502 });
  }

  return new Response(await res.arrayBuffer(), {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
