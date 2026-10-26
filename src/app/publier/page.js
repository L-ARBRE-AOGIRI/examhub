"use client";
import { useState, useEffect } from "react";
import { NIVEAUX, NIVEAUX_ACADEMIQUES, filieresPourNiveau, TYPES_DOCUMENT, LABELS_NIVEAU, LABELS_TYPE, COULEURS_TYPE } from "@/lib/constantes";

export default function Publier() {
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [mesEpreuves, setMesEpreuves] = useState([]);
  const [niveau, setNiveau] = useState("LICENCE_1");

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
      } catch (err) {
        data = {};
      }

      if (res.ok) {
        setSucces(true);
        setMessage("Epreuve envoyee pour validation !");
        form.reset();
        setNiveau("LICENCE_1");
        chargerMesEpreuves();
      } else {
        setSucces(false);
        setMessage(data.erreur || "Erreur lors de l envoi. Reessayez.");
      }
    } catch (err) {
      setSucces(false);
      setMessage("Une erreur est survenue. Verifiez votre connexion et reessayez.");
    } finally {
      setChargement(false);
    }
  }

  function badge(statut) {
    if (statut === "VALIDEE") return "bg-green-100 text-green-700";
    if (statut === "REJETEE") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  }

  const filiereObligatoire = NIVEAUX_ACADEMIQUES.includes(niveau);

  return (
    <main className="max-w-lg mx-auto p-8">
      <form onSubmit={handleSubmit} className="mb-10">
        <fieldset disabled={chargement} className="space-y-4 min-w-0 disabled:opacity-60">
          <h1 className="text-2xl font-bold mb-4">Publier une epreuve</h1>
          <input name="titre" placeholder="Titre" className="border p-2 w-full rounded" required />
          <select name="type" className="border p-2 w-full rounded" required defaultValue="">
            <option value="" disabled>Type de document (cours, exercice, concours...)</option>
            {TYPES_DOCUMENT.map((t) => (
              <option key={t.valeur} value={t.valeur}>{t.label}</option>
            ))}
          </select>
          <select name="niveau" value={niveau} onChange={(e) => setNiveau(e.target.value)} className="border p-2 w-full rounded" required>
            {NIVEAUX.map((n) => (
              <option key={n.valeur} value={n.valeur}>{n.label}</option>
            ))}
          </select>
          {filiereObligatoire && (
            <select key={niveau.startsWith("LICENCE") ? "licence" : "master"} name="filiere" className="border p-2 w-full rounded" required defaultValue="">
              <option value="" disabled>Choisir la filiere</option>
              {filieresPourNiveau(niveau).map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          )}
          <input name="matiere" placeholder="Matiere" className="border p-2 w-full rounded" required />
          <input name="annee" type="number" placeholder="Annee" className="border p-2 w-full rounded" required />
          <input name="fichier" type="file" className="border p-2 w-full rounded" required accept=".pdf,.doc,.docx" />
          <button
            type="submit"
            disabled={chargement}
            className="bg-marque-600 text-white px-4 py-2 rounded w-full hover:bg-marque-700 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
          >
            {chargement && <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
            {chargement ? "Envoi en cours..." : "Envoyer pour validation"}
          </button>
        </fieldset>

        {chargement && (
          <p className="text-sm text-gray-600 mt-3">Envoi du fichier en cours, cela peut prendre quelques secondes. Ne fermez pas cette page.</p>
        )}
        {message && !chargement && (
          <p className={"text-sm mt-3 p-3 rounded " + (succes ? "text-marque-700 bg-marque-50" : "text-red-600 bg-red-50")}>{message}</p>
        )}
      </form>

      {mesEpreuves.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Mes epreuves publiees</h2>
          <div className="space-y-2">
            {mesEpreuves.map((ep) => (
              <div key={ep.id} className="border rounded p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm"><span className={"inline-block text-xs font-medium px-2 py-0.5 rounded mr-2 " + (COULEURS_TYPE[ep.type] || "bg-gray-100 text-gray-700")}>{LABELS_TYPE[ep.type] || ep.type}</span>{ep.titre}</p>
                    <p className="text-xs text-gray-500">{LABELS_NIVEAU[ep.niveau] || ep.niveau}{ep.filiere ? " - " + ep.filiere : ""}</p>
                  </div>
                  <span className={"text-xs px-2 py-0.5 rounded " + badge(ep.statut)}>{ep.statut}</span>
                </div>
                {ep.statut === "REJETEE" && ep.motifRejet && (
                  <p className="text-xs text-red-600 mt-1">Motif : {ep.motifRejet}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
