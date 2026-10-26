export const NIVEAUX = [
  { valeur: "LICENCE_1", label: "Licence 1" },
  { valeur: "LICENCE_2", label: "Licence 2" },
  { valeur: "LICENCE_3", label: "Licence 3" },
  { valeur: "MASTER_1", label: "Master 1" },
  { valeur: "MASTER_2", label: "Master 2" },
  { valeur: "CONCOURS", label: "Concours" },
  { valeur: "EXAMEN_NATIONAL", label: "Examen national" },
];

export const NIVEAUX_LICENCE = ["LICENCE_1", "LICENCE_2", "LICENCE_3"];
export const NIVEAUX_MASTER = ["MASTER_1", "MASTER_2"];
export const NIVEAUX_ACADEMIQUES = [...NIVEAUX_LICENCE, ...NIVEAUX_MASTER];
export const VALEURS_NIVEAU = NIVEAUX.map((n) => n.valeur);
export const LABELS_NIVEAU = Object.fromEntries(NIVEAUX.map((n) => [n.valeur, n.label]));

export const FILIERES_LICENCE_TERTIAIRES = [
  "Finance Comptabilite et Audit",
  "Banque Finance et Assurance",
  "Marketing Communication et Commerce",
  "Gestion des Ressources Humaines",
  "Transport et Logistique",
  "Entreprenariat et Gestion des Projets",
  "Tourisme et Hotellerie",
  "Journalisme",
  "Assistant de Direction",
  "Sciences Juridiques et Politiques",
  "Sciences Economiques",
  "Gestion des Collectivites Locales",
  "Gestion et Passation des Marches",
  "Relations Internationales",
];

export const FILIERES_LICENCE_INDUSTRIELLES = [
  "Genie Informatique",
  "Reseaux Informatiques et Telecommunications",
  "Controle Qualite",
  "Genie Agroalimentaire",
  "Genie electrique et Energies renouvelables",
  "Analyses biomedicales",
  "Securite des Systemes Informatiques",
  "Genie civil",
  "Geometre topographe",
  "Eau et assainissement",
  "Hotellerie et restauration",
  "Froid et climatisation",
];

export const FILIERES_LICENCE = [...FILIERES_LICENCE_TERTIAIRES, ...FILIERES_LICENCE_INDUSTRIELLES];

export const FILIERES_MASTER = [
  "Finance Comptabilite et Audit",
  "Marketing Communication et Commerce",
  "Entreprenariat et Gestion des Projets",
  "Gestion des Ressources Humaines",
  "Banque Finance et Assurance",
  "Fiscalite",
  "Genie Informatique",
  "Droit des Affaires",
  "Sciences Economiques",
  "Gestion des Collectivites Locales",
  "Gestion et Passation des Marches",
  "Journalisme",
  "Transport et Logistique",
  "Analyses biomedicales",
];

export const FILIERES = [...new Set([...FILIERES_LICENCE, ...FILIERES_MASTER])];

export function filieresPourNiveau(niveau) {
  if (NIVEAUX_LICENCE.includes(niveau)) return FILIERES_LICENCE;
  if (NIVEAUX_MASTER.includes(niveau)) return FILIERES_MASTER;
  return [];
}

export function filiereValidePourNiveau(niveau, filiere) {
  return filieresPourNiveau(niveau).includes(filiere);
}

export const TYPES_DOCUMENT = [
  { valeur: "EPREUVE", label: "Epreuve" },
  { valeur: "COURS", label: "Cours" },
  { valeur: "EXERCICE", label: "Exercice" },
  { valeur: "EXAMEN", label: "Examen" },
  { valeur: "CONCOURS", label: "Concours" },
];

export const VALEURS_TYPE = TYPES_DOCUMENT.map((t) => t.valeur);

export const LABELS_TYPE = Object.fromEntries(TYPES_DOCUMENT.map((t) => [t.valeur, t.label]));

export const COULEURS_TYPE = {
  EPREUVE: "bg-marque-100 text-marque-700",
  COURS: "bg-sky-100 text-sky-700",
  EXERCICE: "bg-amber-100 text-amber-700",
  EXAMEN: "bg-purple-100 text-purple-700",
  CONCOURS: "bg-accent-100 text-accent-700",
};
