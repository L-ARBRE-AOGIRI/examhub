import Link from "next/link";
import Icone from "./Icone";

export function AccesRefuse({ chargement }) {
  return (
    <main className="conteneur flex flex-1 items-center justify-center py-20">
      {chargement ? (
        <span className="inline-block h-8 w-8 animate-spin rounded-full border-[3px] border-marque-600 border-t-transparent"></span>
      ) : (
        <div className="carte flex max-w-md flex-col items-center px-8 py-14 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-50 text-accent-600">
            <Icone nom="cadenas" className="h-8 w-8" />
          </span>
          <p className="titre-display mt-5 text-2xl">Accès réservé aux admins</p>
          <p className="mt-2 text-gray-500">Cette page est réservée à l&apos;équipe d&apos;administration.</p>
          <Link href="/" className="btn btn-primaire mt-6">Retour à l&apos;accueil</Link>
        </div>
      )}
    </main>
  );
}

export default function EnteteAdmin({ titre, sousTitre, actif, children }) {
  const onglets = [
    { href: "/admin", label: "Validation", icone: "bouclier" },
    { href: "/admin/utilisateurs", label: "Utilisateurs", icone: "groupe" },
  ];

  return (
    <section className="relative overflow-hidden bg-marque-950 text-white">
      <div className="grille-points absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-marque-500/30 blur-[100px]"></div>
      <div className="conteneur relative pt-12">
        <p className="text-sm font-semibold uppercase tracking-widest text-marque-300">Administration</p>
        <h1 className="titre-display mt-2 text-4xl sm:text-5xl">{titre}</h1>
        {sousTitre && <p className="mt-3 max-w-xl text-marque-100/75">{sousTitre}</p>}
        {children}
        <div className="mt-8 flex gap-1">
          {onglets.map((o) => (
            <Link
              key={o.href}
              href={o.href}
              className={
                "inline-flex items-center gap-2 rounded-t-xl px-5 py-3 text-sm font-semibold transition " +
                (actif === o.href ? "bg-papier text-encre" : "text-marque-100/70 hover:bg-white/5 hover:text-white")
              }
            >
              <Icone nom={o.icone} className="h-4 w-4" />
              {o.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
