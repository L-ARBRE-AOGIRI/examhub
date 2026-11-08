"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { LABELS_NIVEAU, LABELS_TYPE, COULEURS_TYPE } from "@/lib/constantes";
import Icone from "@/components/Icone";
import Apercu from "@/components/Apercu";
import BoutonFavori from "@/components/BoutonFavori";

function Info({ label, valeur }) {
  return (
    <div className="rounded-xl bg-papier px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className="mt-0.5 font-semibold">{valeur}</p>
    </div>
  );
}

export default function DetailEpreuve() {
  const { id } = useParams();
  const { status } = useSession();
  const [epreuve, setEpreuve] = useState(null);
  const [similaires, setSimilaires] = useState([]);
  const [erreur, setErreur] = useState("");
  const [favori, setFavori] = useState(false);

  useEffect(() => {
    fetch("/api/epreuves/" + id + "/detail")
      .then((res) => {
        if (!res.ok) throw new Error("introuvable");
        return res.json();
      })
      .then((data) => {
        setEpreuve(data.epreuve);
        setSimilaires(data.similaires);
      })
      .catch(() => setErreur("Épreuve introuvable ou pas encore validée."));
  }, [id]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/favoris")
      .then((res) => (res.ok ? res.json() : []))
      .then((ids) => setFavori(Array.isArray(ids) && ids.includes(id)))
      .catch(() => {});
  }, [status, id]);

  const lienRetour = (
    <Link href="/epreuves" className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-encre">
      <Icone nom="retour" className="h-4 w-4" /> Retour aux épreuves
    </Link>
  );

  if (erreur) {
    return (
      <main className="conteneur flex-1 py-12">
        {lienRetour}
        <div className="carte mx-auto mt-10 flex max-w-lg flex-col items-center px-6 py-16 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent-50 text-accent-600">
            <Icone nom="document" className="h-8 w-8" />
          </span>
          <p className="titre-display mt-5 text-xl">Document indisponible</p>
          <p className="mt-2 text-gray-500">{erreur}</p>
        </div>
      </main>
    );
  }

  if (!epreuve) {
    return (
      <main className="conteneur flex-1 py-12">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="h-96 rounded-3xl bg-gray-200"></div>
            <div className="h-96 rounded-3xl bg-gray-200"></div>
          </div>
        </div>
      </main>
    );
  }

  const nbTelechargements = epreuve.telechargements || 0;

  return (
    <main className="conteneur flex-1 py-12">
      <div className="mx-auto max-w-5xl">
        {lienRetour}

        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="order-2 lg:order-1 lg:sticky lg:top-24">
            <Apercu id={epreuve.id} disponible={epreuve.aApercu} />
          </div>

          <div className="carte order-1 overflow-hidden lg:order-2">
            <div className="relative overflow-hidden bg-gradient-to-br from-marque-700 to-marque-950 p-8 text-white">
              <div className="grille-points absolute inset-0 opacity-70"></div>
              <Icone nom="document" className="absolute -right-6 -top-6 h-48 w-48 text-white/5" epaisseur={1} />
              <div className="relative">
                <span className={"pastille " + (COULEURS_TYPE[epreuve.type] || "bg-gray-100 text-gray-700")}>
                  {LABELS_TYPE[epreuve.type] || epreuve.type}
                </span>
                <h1 className="titre-display mt-4 text-3xl leading-tight">{epreuve.titre}</h1>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
                  <span className="flex items-center gap-1.5">
                    <Icone nom="utilisateur" className="h-4 w-4" />
                    Ajouté par {epreuve.auteur?.nom || "un membre"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icone nom="telecharger" className="h-4 w-4" />
                    {nbTelechargements} téléchargement{nbTelechargements > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                <Info label="Niveau" valeur={LABELS_NIVEAU[epreuve.niveau] || epreuve.niveau} />
                <Info label="Matière" valeur={epreuve.matiere} />
                <Info label="Année" valeur={epreuve.annee} />
              </div>
              {epreuve.filiere && (
                <div className="mt-3">
                  <Info label="Filière" valeur={epreuve.filiere} />
                </div>
              )}

              <div className="mt-8">
                {status === "authenticated" ? (
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <a
                      href={"/api/epreuves/" + epreuve.id + "/telecharger"}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setEpreuve({ ...epreuve, telechargements: nbTelechargements + 1 })}
                      className="btn btn-primaire flex-1"
                    >
                      <Icone nom="telecharger" className="h-5 w-5" />
                      Télécharger le document
                    </a>
                    <BoutonFavori id={epreuve.id} actif={favori} onChange={setFavori} grand />
                  </div>
                ) : status === "loading" ? (
                  <span className="inline-block h-12 w-full animate-pulse rounded-xl bg-gray-100"></span>
                ) : (
                  <div className="rounded-2xl border border-marque-200 bg-marque-50 p-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface text-marque-700">
                        <Icone nom="cadenas" className="h-5 w-5" />
                      </span>
                      <p className="text-sm text-marque-900">Connectez-vous pour télécharger le document complet. C&apos;est gratuit.</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      <Link href="/connexion" className="btn btn-sm btn-blanc">Se connecter</Link>
                      <Link href="/inscription" className="btn btn-sm btn-primaire">Créer un compte</Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {similaires.length > 0 && (
          <div className="mt-14">
            <h2 className="titre-display text-2xl">Épreuves similaires</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {similaires.map((s) => (
                <Link
                  key={s.id}
                  href={"/epreuves/" + s.id}
                  className="carte group flex items-center gap-4 p-4 transition hover:-translate-y-0.5 hover:border-marque-200 hover:shadow-lg"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-marque-50 text-marque-700">
                    <Icone nom="document" className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold group-hover:text-marque-800">{s.titre}</p>
                    <p className="text-xs text-gray-500">{LABELS_NIVEAU[s.niveau] || s.niveau} · {s.matiere} · {s.annee}</p>
                  </div>
                  <Icone nom="fleche" className="h-4 w-4 shrink-0 text-gray-300 group-hover:text-marque-600" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
