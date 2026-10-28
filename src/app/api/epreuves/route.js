export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getSessionActive } from "@/lib/session";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { VALEURS_NIVEAU, VALEURS_TYPE, NIVEAUX_ACADEMIQUES, FILIERES, filiereValidePourNiveau } from "@/lib/constantes";

const TAILLE_MAX = 4 * 1024 * 1024;
const TYPES_AUTORISES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export async function POST(req) {
  const session = await getSessionActive();
  if (!session) {
    return Response.json({ erreur: "Vous devez etre connecte" }, { status: 401 });
  }

  const formData = await req.formData();
  const fichier = formData.get("fichier");
  const titre = (formData.get("titre") || "").toString().trim();
  const type = (formData.get("type") || "").toString();
  const niveau = (formData.get("niveau") || "").toString();
  const filiere = (formData.get("filiere") || "").toString().trim();
  const matiere = (formData.get("matiere") || "").toString().trim();
  const annee = parseInt(formData.get("annee"));

  if (!fichier || typeof fichier === "string") {
    return Response.json({ erreur: "Fichier manquant" }, { status: 400 });
  }
  if (fichier.size > TAILLE_MAX) {
    return Response.json({ erreur: "Le fichier depasse la taille maximale de 4 Mo" }, { status: 400 });
  }
  if (!TYPES_AUTORISES.includes(fichier.type)) {
    return Response.json({ erreur: "Type de fichier non autorise. Seuls PDF et Word sont acceptes" }, { status: 400 });
  }
  if (!titre || titre.length < 3 || titre.length > 150) {
    return Response.json({ erreur: "Le titre doit contenir entre 3 et 150 caracteres" }, { status: 400 });
  }
  if (!matiere || matiere.length < 2 || matiere.length > 80) {
    return Response.json({ erreur: "La matiere doit contenir entre 2 et 80 caracteres" }, { status: 400 });
  }
  if (!VALEURS_NIVEAU.includes(niveau)) {
    return Response.json({ erreur: "Niveau invalide" }, { status: 400 });
  }
  if (!VALEURS_TYPE.includes(type)) {
    return Response.json({ erreur: "Type invalide" }, { status: 400 });
  }
  if (!annee || annee < 1990 || annee > 2100) {
    return Response.json({ erreur: "Annee invalide" }, { status: 400 });
  }
  if (NIVEAUX_ACADEMIQUES.includes(niveau) && !filiereValidePourNiveau(niveau, filiere)) {
    return Response.json({ erreur: "Choisissez une filiere dans la liste" }, { status: 400 });
  }
  if (filiere.length > 80) {
    return Response.json({ erreur: "Filiere trop longue" }, { status: 400 });
  }

  const bytes = await fichier.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const estPdf = buffer.subarray(0, 5).toString("latin1") === "%PDF-";
  const estDocx = buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
  const estDoc = buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
  if (!estPdf && !estDocx && !estDoc) {
    return Response.json({ erreur: "Le contenu du fichier ne correspond pas a un PDF ou a un document Word" }, { status: 400 });
  }

  const resultatUpload = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "raw", folder: "examhub" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

  const epreuve = await prisma.epreuve.create({
    data: {
      titre,
      type,
      niveau,
      filiere: filiere || null,
      matiere,
      annee,
      fichierUrl: resultatUpload.secure_url,
      auteurId: session.user.id,
    },
  });

  return Response.json({ message: "Epreuve envoyee pour validation", epreuve });
}

export async function GET() {
  const epreuves = await prisma.epreuve.findMany({
    where: { statut: "VALIDEE" },
    orderBy: { createdAt: "desc" },
  });
  return Response.json(epreuves);
}
