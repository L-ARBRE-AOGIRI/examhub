"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { NIVEAUX, FILIERES, TYPES_DOCUMENT, LABELS_NIVEAU, LABELS_TYPE, COULEURS_TYPE } from "@/lib/constantes";
import Icone from "@/components/Icone";
import BoutonFavori from "@/components/BoutonFavori";

const PAR_PAGE = 12;

const BANDE_TYPE = {
  EPREUVE: "bg-marque-500",
  COURS: "bg-sky-500",
  EXERCICE: "bg-amber-500",
  EXAMEN: "bg-purple-500",
  CONCOURS: "bg-accent-500",
};

function Squelette() {
  return (
    <div className="carte animate-pulse p-5">
      <div className="h-5 w-20 rounded-full bg-gray-100"></div>
      <div className="mt-4 h-5 w-4/5 rounded bg-gray-100"></div>
      <div className="mt-2 h-4 w-3/5 rounded bg-gray-100"></div>
      <div className="mt-6 h-4 w-2/5 rounded bg-gray-100"></div>
    </div>
  );
}

export default function Epreuves() {
  const { status } = useSession();
  const [epreuves, setEpreuves] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [type, setType] = useState("");
  const [niveau, setNiveau] = useState("");
  const [filiere, setFiliere] = useState("");
  const [matiere, setMatiere] = useState("");
  const [annee, setAnnee] = useState("");
  const [filtresOuverts, setFiltresOuverts] = useState(false);
  const [tri, setTri] = useState("recents");
  const [page, setPage] = useState(1);
  const [favoris, setFavoris] = useState([]);
  const [seulementFavoris, setSeulementFavoris] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) setRecherche(params.get("q"));
    if (params.get("type")) setType(params.get("type"));
    if (params.get("niveau")) setNiveau(params.get("niveau"));
    if (params.get("filiere")) setFiliere(params.get("filiere"));

    fetch("/api/epreuves")
      .then((res) => res.json())
      .then((data) => setEpreuves(Array.isArray(data) ? data : []))
      .catch(() => setEpreuves([]))
      .finally(() => setChargement(false));
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/favoris")
      .then((res) => (res.ok ? res.json() : []))
      .then((ids) => setFavoris(Array.isArray(ids) ? ids : []))
      .catch(() => {});
  }, [status]);

  function basculerFavori(id, actif) {
    setFavoris((f) => (actif ? [...new Set([...f, id])] : f.filter((x) => x !== id)));
  }

  // Toute modification d'un filtre ramene a la premiere page.
  function filtre(setter) {
    return (valeur) => {
      setter(valeur);
      setPage(1);
    };
  }

  const matieres = [...new Set(epreuves.map((ep) => ep.matiere))].sort();
  const annees = [...new Set(epreuves.map((ep) => ep.annee))].sort((a, b) => b - a);
  const texte = recherche.trim().toLowerCase();

  const filtrees = epreuves.filter((ep) => {
    if (type && ep.type !== type) return false;
    if (niveau && ep.niveau !== niveau) return false;
    if (filiere && ep.filiere !== filiere) return false;
    if (matiere && ep.matiere !== matiere) return false;
    if (annee && String(ep.annee) !== annee) return false;
    if (seulementFavoris && !favoris.includes(ep.id)) return false;
    if (texte) {
      const cible = [ep.titre, ep.matiere, ep.filiere || "", LABELS_TYPE[ep.type] || "", LABELS_NIVEAU[ep.niveau] || ""].join(" ").toLowerCase();
      if (!cible.includes(texte)) return false;
    }
    return true;
  });

  const triees = [...filtrees].sort((a, b) => {
    if (tri === "populaires") return (b.telechargements || 0) - (a.telechargements || 0);
    if (tri === "annee") return b.annee - a.annee;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });
  const nbPages = Math.max(1, Math.ceil(triees.length / PAR_PAGE));
  const pageCourante = Math.min(page, nbPages);
  const affichees = triees.slice((pageCourante - 1) * PAR_PAGE, pageCourante * PAR_PAGE);

  function allerPage(n) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function reinitialiser() {
    setRecherche("");
    setType("");
    setNiveau("");
    setFiliere("");
    setMatiere("");
    setAnnee("");
    setSeulementFavoris(false);
    setPage(1);
  }

  const filtresActifs = type || niveau || filiere || matiere || annee || recherche || seulementFavoris;
  const nbFiltres = [niveau, filiere, matiere, annee].filter(Boolean).length;

  function styleOnglet(actif) {
    return (
      "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition duration-200 " +
      (actif ? "bg-marque-600 text-white shadow-md" : "bg-surface text-gray-600 ring-1 ring-trait hover:text-encre hover:ring-gray-300")
    );
  }

  function compte(n, actif) {
    return (
      <span className={"rounded-full px-1.5 text-xs " + (actif ? "bg-white/20" : "bg-gray-100 text-gray-500")}>{n}</span>
    );
  }

  const panneauFiltres = (
    <div className="space-y-5">
      <div>
        <label className="etiquette">Niveau</label>
        <select value={niveau} onChange={(e) => filtre(setNiveau)(e.target.value)} className="champ">
          <option value="">Tous les niveaux</option>
          {NIVEAUX.map((n) => (
            <option key={n.valeur} value={n.valeur}>{n.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="etiquette">Filière</label>
        <select value={filiere} onChange={(e) => filtre(setFiliere)(e.target.value)} className="champ">
          <option value="">Toutes les filières</option>
          {FILIERES.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="etiquette">Matière</label>
        <select value={matiere} onChange={(e) => filtre(setMatiere)(e.target.value)} className="champ">
          <option value="">Toutes les matières</option>
          {matieres.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="etiquette">Année</label>
        <select value={annee} onChange={(e) => filtre(setAnnee)(e.target.value)} className="champ">
          <option value="">Toutes les années</option>
          {annees.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      {filtresActifs && (
        <button onClick={reinitialiser} className="btn btn-sm btn-blanc w-full">
          <Icone nom="croix" className="h-4 w-4" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-marque-950 text-white">
        <div className="grille-points absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-marque-500/30 blur-[100px]"></div>
        <div className="conteneur relative pb-24 pt-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-marque-300">Bibliothèque</p>
          <h1 className="titre-display mt-2 text-4xl sm:text-5xl">Documents disponibles</h1>
          <p className="mt-3 max-w-xl text-marque-100/75">Épreuves, cours, exercices et annales partagés et vérifiés par la communauté HECM.</p>
        </div>
      </section>

      <div className="conteneur relative -mt-14 pb-20">
        <div className="carte flex items-center gap-3 p-2 shadow-xl shadow-marque-950/5">
          <Icone nom="recherche" className="ml-3 h-5 w-5 shrink-0 text-gray-400" />
          <input
            placeholder="Rechercher par titre, matière, type..."
            value={recherche}
            onChange={(e) => filtre(setRecherche)(e.target.value)}
            className="w-full bg-transparent py-3 text-[15px] outline-none placeholder:text-gray-400"
          />
          {recherche && (
            <button onClick={() => filtre(setRecherche)("")} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-gray-100" aria-label="Effacer">
              <Icone nom="croix" className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={() => setFiltresOuverts(!filtresOuverts)}
            className="btn btn-sm btn-blanc shrink-0 lg:hidden"
          >
            <Icone nom="filtre" className="h-4 w-4" />
            Filtres{nbFiltres > 0 && <span className="rounded-full bg-marque-600 px-1.5 text-xs text-white">{nbFiltres}</span>}
          </button>
        </div>

        <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          <button onClick={() => filtre(setType)("")} className={styleOnglet(type === "")}>
            Tout {compte(epreuves.length, type === "")}
          </button>
          {TYPES_DOCUMENT.map((t) => (
            <button key={t.valeur} onClick={() => filtre(setType)(type === t.valeur ? "" : t.valeur)} className={styleOnglet(type === t.valeur)}>
              {t.label} {compte(epreuves.filter((ep) => ep.type === t.valeur).length, type === t.valeur)}
            </button>
          ))}
          {status === "authenticated" && (
            <button
              onClick={() => filtre(setSeulementFavoris)(!seulementFavoris)}
              className={
                "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition duration-200 " +
                (seulementFavoris ? "bg-accent-500 text-white shadow-md" : "bg-surface text-gray-600 ring-1 ring-trait hover:text-accent-600")
              }
            >
              ♥ Mes favoris {compte(favoris.length, seulementFavoris)}
            </button>
          )}
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className={(filtresOuverts ? "block" : "hidden") + " lg:block"}>
            <div className="carte p-5 lg:sticky lg:top-24">
              <p className="mb-5 flex items-center gap-2 font-semibold">
                <Icone nom="filtre" className="h-4 w-4 text-marque-600" /> Affiner
              </p>
              {panneauFiltres}
            </div>
          </aside>

          <div>
            {chargement ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1, 2, 3, 4, 5].map((i) => <Squelette key={i} />)}
              </div>
            ) : (
              <>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold text-encre">{filtrees.length}</span> document{filtrees.length > 1 ? "s" : ""} trouvé{filtrees.length > 1 ? "s" : ""}
                  </p>
                  <label className="flex items-center gap-2 text-sm text-gray-500">
                    Trier par
                    <select value={tri} onChange={(e) => filtre(setTri)(e.target.value)} className="champ w-auto py-2 text-sm">
                      <option value="recents">Plus récents</option>
                      <option value="populaires">Plus téléchargés</option>
                      <option value="annee">Année (récente d&apos;abord)</option>
                    </select>
                  </label>
                </div>

                {filtrees.length === 0 ? (
                  <div className="carte flex flex-col items-center px-6 py-16 text-center">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-marque-50 text-marque-600">
                      <Icone nom="document" className="h-8 w-8" />
                    </span>
                    <p className="titre-display mt-5 text-xl">Aucun document trouvé</p>
                    <p className="mt-2 max-w-sm text-gray-500">
                      {seulementFavoris && favoris.length === 0
                        ? "Vous n'avez encore aucun favori. Cliquez sur le cœur d'un document pour le retrouver ici."
                        : epreuves.length === 0
                        ? "La bibliothèque est encore vide. Soyez le premier à partager un document !"
                        : "Aucun document ne correspond à ces critères. Essayez d'élargir votre recherche."}
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {filtresActifs && <button onClick={reinitialiser} className="btn btn-sm btn-blanc">Réinitialiser les filtres</button>}
                      <Link href="/publier" className="btn btn-sm btn-primaire">
                        <Icone nom="envoyer" className="h-4 w-4" /> Publier un document
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {affichees.map((ep) => (
                      <Link
                        key={ep.id}
                        href={"/epreuves/" + ep.id}
                        className="carte group relative flex flex-col overflow-hidden p-5 transition duration-200 hover:-translate-y-1 hover:border-marque-200 hover:shadow-xl hover:shadow-marque-950/5"
                      >
                        <span className={"absolute inset-y-0 left-0 w-1 " + (BANDE_TYPE[ep.type] || "bg-gray-300")}></span>
                        <div className="flex items-center justify-between gap-3">
                          <span className={"pastille " + (COULEURS_TYPE[ep.type] || "bg-gray-100 text-gray-700")}>
                            {LABELS_TYPE[ep.type] || ep.type}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-gray-400">{ep.annee}</span>
                            <BoutonFavori id={ep.id} actif={favoris.includes(ep.id)} onChange={(actif) => basculerFavori(ep.id, actif)} />
                          </div>
                        </div>
                        <p className="mt-3 text-[17px] font-semibold leading-snug group-hover:text-marque-800">{ep.titre}</p>
                        <p className="mt-1 text-sm text-gray-500">{ep.matiere}</p>
                        <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-xs text-gray-500">
                          <span className="truncate">
                            {LABELS_NIVEAU[ep.niveau] || ep.niveau}{ep.filiere ? " · " + ep.filiere : ""}
                          </span>
                          {ep.telechargements > 0 && (
                            <span className="flex shrink-0 items-center gap-1" title="Téléchargements">
                              <Icone nom="telecharger" className="h-3.5 w-3.5" />
                              {ep.telechargements}
                            </span>
                          )}
                          <Icone nom="fleche" className="h-4 w-4 shrink-0 text-marque-600 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {nbPages > 1 && (
                  <nav className="mt-10 flex items-center justify-center gap-1.5" aria-label="Pagination">
                    <button onClick={() => allerPage(pageCourante - 1)} disabled={pageCourante === 1} className="btn btn-sm btn-blanc" aria-label="Page précédente">
                      <Icone nom="retour" className="h-4 w-4" />
                    </button>
                    {Array.from({ length: nbPages }, (_, i) => i + 1)
                      .filter((n) => n === 1 || n === nbPages || Math.abs(n - pageCourante) <= 1)
                      .map((n, i, liste) => (
                        <span key={n} className="flex items-center gap-1.5">
                          {i > 0 && n - liste[i - 1] > 1 && <span className="px-1 text-gray-400">…</span>}
                          <button
                            onClick={() => allerPage(n)}
                            className={"grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold transition " + (n === pageCourante ? "bg-marque-600 text-white" : "text-gray-600 hover:bg-gray-100")}
                            aria-current={n === pageCourante ? "page" : undefined}
                          >
                            {n}
                          </button>
                        </span>
                      ))}
                    <button onClick={() => allerPage(pageCourante + 1)} disabled={pageCourante === nbPages} className="btn btn-sm btn-blanc" aria-label="Page suivante">
                      <Icone nom="fleche" className="h-4 w-4" />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
