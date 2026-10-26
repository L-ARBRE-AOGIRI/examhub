"use client";
import { useEffect, useState } from "react";
import { NIVEAUX, FILIERES, TYPES_DOCUMENT, LABELS_NIVEAU, LABELS_TYPE, COULEURS_TYPE } from "@/lib/constantes";

export default function Epreuves() {
  const [epreuves, setEpreuves] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [type, setType] = useState("");
  const [niveau, setNiveau] = useState("");
  const [filiere, setFiliere] = useState("");
  const [matiere, setMatiere] = useState("");
  const [annee, setAnnee] = useState("");

  useEffect(() => {
    fetch("/api/epreuves")
      .then((res) => res.json())
      .then((data) => setEpreuves(Array.isArray(data) ? data : []))
      .catch(() => setEpreuves([]))
      .finally(() => setChargement(false));
  }, []);

  const matieres = [...new Set(epreuves.map((ep) => ep.matiere))].sort();
  const annees = [...new Set(epreuves.map((ep) => ep.annee))].sort((a, b) => b - a);
  const texte = recherche.trim().toLowerCase();

  const filtrees = epreuves.filter((ep) => {
    if (type && ep.type !== type) return false;
    if (niveau && ep.niveau !== niveau) return false;
    if (filiere && ep.filiere !== filiere) return false;
    if (matiere && ep.matiere !== matiere) return false;
    if (annee && String(ep.annee) !== annee) return false;
    if (texte) {
      const cible = [ep.titre, ep.matiere, ep.filiere || "", LABELS_TYPE[ep.type] || "", LABELS_NIVEAU[ep.niveau] || ""].join(" ").toLowerCase();
      if (!cible.includes(texte)) return false;
    }
    return true;
  });

  function reinitialiser() {
    setRecherche("");
    setType("");
    setNiveau("");
    setFiliere("");
    setMatiere("");
    setAnnee("");
  }

  const filtresActifs = type || niveau || filiere || matiere || annee || recherche;

  function styleBouton(actif) {
    return "px-4 py-1.5 rounded-full text-sm border transition-all duration-200 " +
      (actif
        ? "bg-marque-600 text-white border-marque-600 shadow"
        : "bg-white text-gray-700 border-gray-300 hover:border-marque-500 hover:text-marque-700");
  }

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Documents disponibles</h1>

      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setType("")} className={styleBouton(type === "")}>
            Tout ({epreuves.length})
          </button>
          {TYPES_DOCUMENT.map((t) => (
            <button key={t.valeur} onClick={() => setType(type === t.valeur ? "" : t.valeur)} className={styleBouton(type === t.valeur)}>
              {t.label} ({epreuves.filter((ep) => ep.type === t.valeur).length})
            </button>
          ))}
        </div>

        <input
          placeholder="Rechercher par titre, matiere, type..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select value={niveau} onChange={(e) => setNiveau(e.target.value)} className="border p-2 rounded">
            <option value="">Tous les niveaux</option>
            {NIVEAUX.map((n) => (
              <option key={n.valeur} value={n.valeur}>{n.label}</option>
            ))}
          </select>
          <select value={filiere} onChange={(e) => setFiliere(e.target.value)} className="border p-2 rounded">
            <option value="">Toutes les filieres</option>
            {FILIERES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <select value={matiere} onChange={(e) => setMatiere(e.target.value)} className="border p-2 rounded">
            <option value="">Toutes les matieres</option>
            {matieres.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <select value={annee} onChange={(e) => setAnnee(e.target.value)} className="border p-2 rounded">
            <option value="">Toutes les annees</option>
            {annees.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        {filtresActifs && (
          <button onClick={reinitialiser} className="text-sm text-marque-600 underline">Reinitialiser les filtres</button>
        )}
      </div>

      {chargement ? (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="inline-block w-4 h-4 border-2 border-marque-600 border-t-transparent rounded-full animate-spin"></span>
          Chargement...
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{filtrees.length} document(s) trouve(s)</p>
          {filtrees.length === 0 && <p className="text-gray-500">Aucun document ne correspond a ces criteres.</p>}
          <div className="space-y-3">
            {filtrees.map((ep) => (
              <a key={ep.id} href={"/epreuves/" + ep.id} className="block border rounded p-4 hover:bg-gray-50 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <span className={"shrink-0 text-xs font-medium px-2 py-0.5 rounded " + (COULEURS_TYPE[ep.type] || "bg-gray-100 text-gray-700")}>
                    {LABELS_TYPE[ep.type] || ep.type}
                  </span>
                  <div>
                    <p className="font-medium">{ep.titre}</p>
                    <p className="text-sm text-gray-500">{LABELS_NIVEAU[ep.niveau] || ep.niveau} - {ep.matiere} - {ep.annee}{ep.filiere ? " - " + ep.filiere : ""}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
