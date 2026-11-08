"use client";
import { useState, useEffect } from "react";
import { NIVEAUX, NIVEAUX_ACADEMIQUES, filieresPourNiveau, TYPES_DOCUMENT, LABELS_NIVEAU, LABELS_TYPE, COULEURS_TYPE } from "@/lib/constantes";
import Icone from "@/components/Icone";
import { Spinner } from "@/components/CadreAuth";
import { useRetours } from "@/components/Retours";

const STATUTS = {
  VALIDEE: { label: "Validée", style: "bg-marque-100 text-marque-800", icone: "coche" },
  REJETEE: { label: "Rejetée", style: "bg-accent-100 text-accent-800", icone: "croix" },
  EN_ATTENTE: { label: "En attente", style: "bg-amber-100 text-amber-800", icone: "horloge" },
};

export default function Publier() {
  const { notifier } = useRetours();
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [mesEpreuves, setMesEpreuves] = useState([]);
  const [niveau, setNiveau] = useState("LICENCE_1");
  const [nomFichier, setNomFichier] = useState("");
  const [survol, setSurvol] = useState(false);

  async function chargerMesEpreuves() {
    const res = await fetch("/api/mes-epreuves");
    if (res.ok) setMesEpreuves(await res.json());
  }

  useEffect(() => {
    chargerMesEpreuves();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (chargement) return;

    const form = e.target;
    const donnees = new FormData(form);

    const fichierChoisi = donnees.get("fichier");
    if (fichierChoisi && fichierChoisi.size > 4 * 1024 * 1024) {
      setSucces(false);
      setMessage("Fichier trop volumineux (" + (fichierChoisi.size / 1024 / 1024).toFixed(1) + " Mo). Maximum : 4 Mo. Réduisez-le (compression PDF) puis réessayez.");
      return;
    }

    setMessage("");
    setChargement(true);

    try {
      const res = await fetch("/api/epreuves", {
        method: "POST",
        body: donnees,
      });

      let data = {};
      try {
        data = await res.json();
        if (res.status === 413) data = { erreur: "Fichier trop volumineux. Maximum : 4 Mo." };
      } catch (err) {
        data = {};
      }

      if (res.ok) {
        setSucces(true);
        setMessage("Épreuve envoyée pour validation !");
        notifier("Document envoyé ! Un admin va le vérifier.");
        form.reset();
        setNiveau("LICENCE_1");
        setNomFichier("");
        chargerMesEpreuves();
      } else {
        setSucces(false);
        setMessage(data.erreur || "Erreur lors de l'envoi. Réessayez.");
      }
    } catch (err) {
      setSucces(false);
      setMessage("Une erreur est survenue. Vérifiez votre connexion et réessayez.");
    } finally {
      setChargement(false);
    }
  }

  const filiereObligatoire = NIVEAUX_ACADEMIQUES.includes(niveau);

  return (
    <main className="flex-1">
      <section className="relative overflow-hidden bg-marque-950 text-white">
        <div className="grille-points absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent-500/20 blur-[100px]"></div>
        <div className="conteneur relative pb-24 pt-14">
          <p className="text-sm font-semibold uppercase tracking-widest text-marque-300">Contribuer</p>
          <h1 className="titre-display mt-2 text-4xl sm:text-5xl">Publier une épreuve</h1>
          <p className="mt-3 max-w-xl text-marque-100/75">Partagez vos sujets avec la communauté. Chaque document est vérifié par un administrateur avant d&apos;être publié.</p>
        </div>
      </section>

      <div className="conteneur relative -mt-14 grid gap-8 pb-20 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="carte p-6 shadow-xl shadow-marque-950/5 sm:p-8">
          <fieldset disabled={chargement} className="min-w-0 space-y-5 disabled:opacity-60">
            <div>
              <label htmlFor="titre" className="etiquette">Titre du document</label>
              <input id="titre" name="titre" placeholder="Ex. : Comptabilité générale — Session normale" className="champ" required />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="type" className="etiquette">Type de document</label>
                <select id="type" name="type" className="champ" required defaultValue="">
                  <option value="" disabled>Choisir un type</option>
                  {TYPES_DOCUMENT.map((t) => (
                    <option key={t.valeur} value={t.valeur}>{t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="niveau" className="etiquette">Niveau</label>
                <select id="niveau" name="niveau" value={niveau} onChange={(e) => setNiveau(e.target.value)} className="champ" required>
                  {NIVEAUX.map((n) => (
                    <option key={n.valeur} value={n.valeur}>{n.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {filiereObligatoire && (
              <div>
                <label htmlFor="filiere" className="etiquette">Filière</label>
                <select id="filiere" key={niveau.startsWith("LICENCE") ? "licence" : "master"} name="filiere" className="champ" required defaultValue="">
                  <option value="" disabled>Choisir la filière</option>
                  {filieresPourNiveau(niveau).map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
              <div>
                <label htmlFor="matiere" className="etiquette">Matière</label>
                <input id="matiere" name="matiere" placeholder="Ex. : Comptabilité" className="champ" required />
              </div>
              <div>
                <label htmlFor="annee" className="etiquette">Année</label>
                <input id="annee" name="annee" type="number" placeholder="2024" className="champ" required />
              </div>
            </div>

            <div>
              <span className="etiquette">Fichier</span>
              <label
                onDragEnter={() => setSurvol(true)}
                onDragLeave={() => setSurvol(false)}
                onDrop={() => setSurvol(false)}
                className={
                  "relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition " +
                  (survol ? "border-marque-500 bg-marque-50" : nomFichier ? "border-marque-300 bg-marque-50/50" : "border-trait bg-papier hover:border-marque-300 hover:bg-marque-50/40")
                }
              >
                <input
                  name="fichier"
                  type="file"
                  required
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setNomFichier(e.target.files?.[0]?.name || "")}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <span className={"grid h-12 w-12 place-items-center rounded-2xl " + (nomFichier ? "bg-marque-600 text-white" : "bg-surface text-marque-600 shadow-sm")}>
                  <Icone nom={nomFichier ? "document" : "envoyer"} className="h-6 w-6" />
                </span>
                {nomFichier ? (
                  <>
                    <p className="mt-3 max-w-full truncate font-semibold text-marque-800">{nomFichier}</p>
                    <p className="mt-1 text-xs text-gray-500">Cliquez pour changer de fichier</p>
                  </>
                ) : (
                  <>
                    <p className="mt-3 font-semibold">
                      <span className="text-marque-700">Choisissez un fichier</span> ou glissez-le ici
                    </p>
                    <p className="mt-1 text-xs text-gray-500">PDF, DOC ou DOCX — 4 Mo maximum</p>
                  </>
                )}
              </label>
            </div>

            <button type="submit" disabled={chargement} className="btn btn-primaire w-full">
              {chargement ? <Spinner /> : <Icone nom="envoyer" className="h-5 w-5" />}
              {chargement ? "Envoi en cours..." : "Envoyer pour validation"}
            </button>
          </fieldset>

          {chargement && (
            <p className="alerte-info mt-4">Envoi du fichier en cours, cela peut prendre quelques secondes. Ne fermez pas cette page.</p>
          )}
          {message && !chargement && (
            <p className={"mt-4 " + (succes ? "alerte-succes" : "alerte-erreur")}>{message}</p>
          )}
        </form>

        <aside className="space-y-6">
          <div className="carte p-6">
            <p className="flex items-center gap-2 font-semibold">
              <Icone nom="etincelle" className="h-5 w-5 text-accent-500" /> Conseils
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li className="flex gap-2.5"><Icone nom="coche" className="mt-0.5 h-4 w-4 shrink-0 text-marque-600" epaisseur={2.5} />Un titre clair : matière + session</li>
              <li className="flex gap-2.5"><Icone nom="coche" className="mt-0.5 h-4 w-4 shrink-0 text-marque-600" epaisseur={2.5} />Un scan lisible, de préférence en PDF</li>
              <li className="flex gap-2.5"><Icone nom="coche" className="mt-0.5 h-4 w-4 shrink-0 text-marque-600" epaisseur={2.5} />Fichier trop lourd ? Compressez-le avant l&apos;envoi</li>
            </ul>
          </div>

          <div className="carte p-6">
            <p className="font-semibold">Mes documents publiés</p>
            {mesEpreuves.length === 0 ? (
              <p className="mt-3 text-sm text-gray-500">Vous n&apos;avez encore rien publié. Votre premier document apparaîtra ici.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {mesEpreuves.map((ep) => {
                  const s = STATUTS[ep.statut] || STATUTS.EN_ATTENTE;
                  return (
                    <div key={ep.id} className="rounded-xl border border-trait p-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className={"pastille " + (COULEURS_TYPE[ep.type] || "bg-gray-100 text-gray-700")}>{LABELS_TYPE[ep.type] || ep.type}</span>
                          <p className="mt-1.5 truncate text-sm font-semibold">{ep.titre}</p>
                          <p className="truncate text-xs text-gray-500">{LABELS_NIVEAU[ep.niveau] || ep.niveau}{ep.filiere ? " · " + ep.filiere : ""}</p>
                        </div>
                        <span className={"pastille shrink-0 " + s.style}>
                          <Icone nom={s.icone} className="h-3 w-3" epaisseur={2.5} />
                          {s.label}
                        </span>
                      </div>
                      {ep.statut === "REJETEE" && ep.motifRejet && (
                        <p className="mt-2 rounded-lg bg-accent-50 px-2.5 py-1.5 text-xs text-accent-800">Motif : {ep.motifRejet}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}
