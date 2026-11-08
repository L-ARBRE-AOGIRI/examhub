import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";
import { authOptions } from "@/lib/auth";
import { VALEURS_NIVEAU, VALEURS_TYPE, NIVEAUX_ACADEMIQUES, FILIERES, filiereValidePourNiveau } from "@/lib/constantes";

export async function PUT(req, context) {
  const session = await getSessionActive();
  if (!session || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return Response.json({ erreur: "Accès refusé" }, { status: 403 });
  }

  const { id } = await context.params;
  const body = await req.json();

  const titre = (body.titre || "").toString().trim();
  const type = (body.type || "").toString();
  const niveau = (body.niveau || "").toString();
  const filiere = (body.filiere || "").toString().trim();
  const matiere = (body.matiere || "").toString().trim();
  const annee = parseInt(body.annee);

  if (!titre || titre.length < 3 || titre.length > 150) {
    return Response.json({ erreur: "Le titre doit contenir entre 3 et 150 caractères" }, { status: 400 });
  }
  if (!matiere || matiere.length < 2 || matiere.length > 80) {
    return Response.json({ erreur: "La matière doit contenir entre 2 et 80 caractères" }, { status: 400 });
  }
  if (!VALEURS_NIVEAU.includes(niveau)) {
    return Response.json({ erreur: "Niveau invalide" }, { status: 400 });
  }
  if (!VALEURS_TYPE.includes(type)) {
    return Response.json({ erreur: "Type invalide" }, { status: 400 });
  }
  if (!annee || annee < 1990 || annee > 2100) {
    return Response.json({ erreur: "Année invalide" }, { status: 400 });
  }
  if (NIVEAUX_ACADEMIQUES.includes(niveau) && !filiereValidePourNiveau(niveau, filiere)) {
    return Response.json({ erreur: "Choisissez une filière dans la liste" }, { status: 400 });
  }
  if (filiere.length > 80) {
    return Response.json({ erreur: "Filière trop longue" }, { status: 400 });
  }

  const epreuve = await prisma.epreuve.update({
    where: { id },
    data: { titre, type, niveau, filiere: filiere || null, matiere, annee },
  });

  return Response.json({ message: "Épreuve modifiée", epreuve });
}
