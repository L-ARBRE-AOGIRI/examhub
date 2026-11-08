const CHEMINS = {
  recherche: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  fleche: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  retour: <><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
  document: <><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></>,
  telecharger: <><path d="M12 4v11" /><path d="m7 10 5 5 5-5" /><path d="M5 20h14" /></>,
  envoyer: <><path d="M12 20V9" /><path d="m7 14 5-5 5 5" /><path d="M5 4h14" /></>,
  bouclier: <><path d="M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  groupe: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c.6-3.4 3.2-5.5 6.5-5.5s5.9 2.1 6.5 5.5" /><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8" /><path d="M18.5 14.8c1.7.8 2.8 2.5 3 5.2" /></>,
  filtre: <><path d="M4 5h16" /><path d="M7 12h10" /><path d="M10 19h4" /></>,
  oeil: <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>,
  oeilBarre: <><path d="M3 3l18 18" /><path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4" /><path d="M6.6 6.6C3.8 8.4 2 12 2 12s3.6 7 10 7c1.8 0 3.4-.5 4.7-1.3" /><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" /></>,
  sortie: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="m10 16-4-4 4-4" /><path d="M6 12h10" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  fermer: <><path d="M6 6l12 12M18 6 6 18" /></>,
  coche: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  croix: <path d="M6 6l12 12M18 6 6 18" />,
  crayon: <><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>,
  corbeille: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" /><path d="M9 7V4h6v3" /></>,
  cadenas: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  cadenasOuvert: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 7.5-2" /></>,
  etoile: <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  diplome: <><path d="M2 9l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5" /><path d="M22 9v6" /></>,
  livre: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19a2 2 0 0 1 2-2h13" /></>,
  trophee: <><path d="M8 4h8v5a4 4 0 0 1-8 0z" /><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4" /><path d="M12 13v4M8 21h8M9 17h6" /></>,
  drapeau: <><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>,
  promouvoir: <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>,
  retrograder: <><path d="M12 5v14" /><path d="m6 13 6 6 6-6" /></>,
  horloge: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  courrier: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  utilisateur: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.8-4 4-6.5 8-6.5s7.2 2.5 8 6.5" /></>,
  etincelle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4" /><path d="m6 6 2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6" /></>,
};

export default function Icone({ nom, className = "w-5 h-5", epaisseur = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={epaisseur}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {CHEMINS[nom]}
    </svg>
  );
}
