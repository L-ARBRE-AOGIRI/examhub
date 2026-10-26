"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NIVEAUX, NIVEAUX_ACADEMIQUES, filieresPourNiveau, LABELS_NIVEAU, LABELS_TYPE, COULEURS_TYPE, TYPES_DOCUMENT } from "@/lib/constantes";

export default function Admin() {
  const { data: session, status } = useSession();
  const [epreuves, setEpreuves] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [erreur, setErreur] = useState("");
  const [edition, setEdition] = useState(null);
  const [formEdition, setFormEdition] = useState({});
  const [rejetEpreuve, setRejetEpreuve] = useState(null);
  const [motifEpreuve, setMotifEpreuve] = useState("");
  const [rejetUtilisateur, setRejetUtilisateur] = useState(null);
  const [motifUtilisateur, setMotifUtilisateur] = useState("");

  async function charger() {
    const res = await fetch("/api/admin/en-attente");
    if (res.ok) {
      const data = await res.json();
      setEpreuves(data.epreuves);
      setUtilisateurs(data.utilisateurs);
    } else {
      const data = await res.json();
      setErreur("Erreur chargement: " + (data.erreur || res.status));
    }
  }

  useEffect(() => {
    if (status === "authenticated") charger();
  }, [status]);

  async function traiterEpreuve(id, statut, motifRejet) {
    const res = await fetch("/api/epreuves/" + id + "/valider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut, motifRejet }),
    });
    if (!res.ok) {
      const data = await res.json();
      setErreur("Erreur: " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    setRejetEpreuve(null);
    setMotifEpreuve("");
    charger();
  }

  async function traiterUtilisateur(id, statut, motifRejet) {
    const res = await fetch("/api/utilisateurs/" + id + "/valider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut, motifRejet }),
    });
    if (!res.ok) {
      const data = await res.json();
      setErreur("Erreur: " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    setRejetUtilisateur(null);
    setMotifUtilisateur("");
    charger();
  }

  function ouvrirEdition(ep) {
    setEdition(ep.id);
    setFormEdition({
      titre: ep.titre,
      type: ep.type,
      niveau: ep.niveau,
      filiere: ep.filiere || "",
      matiere: ep.matiere,
      annee: ep.annee,
    });
  }

  async function enregistrerEdition(id) {
    const res = await fetch("/api/epreuves/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formEdition),
    });
    if (!res.ok) {
      const data = await res.json();
      setErreur("Erreur: " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    setEdition(null);
    charger();
  }

  if (status === "loading") return <p className="p-8">Chargement...</p>;
  if (status !== "authenticated" || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return <p className="p-8">Acces reserve aux admins.</p>;
  }

  return (
    <main className="max-w-4xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-bold">Tableau de bord admin</h1>
      {erreur && <p className="text-red-600 bg-red-50 p-3 rounded">{erreur}</p>}

      <section>
        <h2 className="text-xl font-semibold mb-4">Epreuves en attente ({epreuves.length})</h2>
        {epreuves.length === 0 && <p className="text-gray-500">Rien a valider.</p>}
        <div className="space-y-3">
          {epreuves.map((ep) => (
            <div key={ep.id} className="border rounded p-4">
              {edition === ep.id ? (
                <div className="space-y-2">
                  <input className="border p-2 w-full rounded" value={formEdition.titre} onChange={(e) => setFormEdition({ ...formEdition, titre: e.target.value })} placeholder="Titre" />
                  <div className="grid grid-cols-2 gap-2">
                    <input className="border p-2 rounded" value={formEdition.matiere} onChange={(e) => setFormEdition({ ...formEdition, matiere: e.target.value })} placeholder="Matiere" />
                    <input className="border p-2 rounded" type="number" value={formEdition.annee} onChange={(e) => setFormEdition({ ...formEdition, annee: e.target.value })} placeholder="Annee" />
                    <select className="border p-2 rounded" value={formEdition.type} onChange={(e) => setFormEdition({ ...formEdition, type: e.target.value })}>
                      {TYPES_DOCUMENT.map((t) => (
                        <option key={t.valeur} value={t.valeur}>{t.label}</option>
                      ))}
                    </select>
                    <select className="border p-2 rounded" value={formEdition.niveau} onChange={(e) => setFormEdition({ ...formEdition, niveau: e.target.value })}>
                      {NIVEAUX.map((n) => (
                        <option key={n.valeur} value={n.valeur}>{n.label}</option>
                      ))}
                    </select>
                    {NIVEAUX_ACADEMIQUES.includes(formEdition.niveau) ? (
                      <select className="border p-2 rounded" value={formEdition.filiere} onChange={(e) => setFormEdition({ ...formEdition, filiere: e.target.value })}>
                        <option value="">Choisir la filiere</option>
                        {filieresPourNiveau(formEdition.niveau).map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    ) : (
                      <input className="border p-2 rounded bg-gray-50" value="Filiere non requise" disabled />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => enregistrerEdition(ep.id)} className="bg-marque-600 text-white px-3 py-1 rounded">Enregistrer</button>
                    <button onClick={() => setEdition(null)} className="bg-gray-300 px-3 py-1 rounded">Annuler</button>
                  </div>
                </div>
              ) : rejetEpreuve === ep.id ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Motif du rejet pour "{ep.titre}" :</p>
                  <textarea className="border p-2 w-full rounded" rows="2" value={motifEpreuve} onChange={(e) => setMotifEpreuve(e.target.value)} placeholder="Expliquez pourquoi cette epreuve est rejetee (optionnel)" />
                  <div className="flex gap-2">
                    <button onClick={() => traiterEpreuve(ep.id, "REJETEE", motifEpreuve)} className="bg-red-600 text-white px-3 py-1 rounded">Confirmer le rejet</button>
                    <button onClick={() => { setRejetEpreuve(null); setMotifEpreuve(""); }} className="bg-gray-300 px-3 py-1 rounded">Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium"><span className={"inline-block text-xs font-medium px-2 py-0.5 rounded mr-2 " + (COULEURS_TYPE[ep.type] || "bg-gray-100 text-gray-700")}>{LABELS_TYPE[ep.type] || ep.type}</span>{ep.titre}</p>
                    <p className="text-sm text-gray-600">{LABELS_NIVEAU[ep.niveau] || ep.niveau} - {ep.matiere}{ep.filiere ? " - " + ep.filiere : ""}</p>
                    <p className="text-sm text-gray-500">Par {ep.auteur?.nom} ({ep.auteur?.email})</p>
                    <a href={ep.fichierUrl} target="_blank" className="text-marque-600 text-sm underline">Voir le fichier</a>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => ouvrirEdition(ep)} className="bg-gray-200 px-3 py-1 rounded">Modifier</button>
                    <button onClick={() => traiterEpreuve(ep.id, "VALIDEE")} className="bg-green-600 text-white px-3 py-1 rounded">Valider</button>
                    <button onClick={() => setRejetEpreuve(ep.id)} className="bg-red-600 text-white px-3 py-1 rounded">Rejeter</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Comptes en attente ({utilisateurs.length})</h2>
        {utilisateurs.length === 0 && <p className="text-gray-500">Rien a valider.</p>}
        <div className="space-y-3">
          {utilisateurs.map((u) => (
            <div key={u.id} className="border rounded p-4">
              {rejetUtilisateur === u.id ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Motif du rejet pour "{u.nom}" :</p>
                  <textarea className="border p-2 w-full rounded" rows="2" value={motifUtilisateur} onChange={(e) => setMotifUtilisateur(e.target.value)} placeholder="Expliquez pourquoi ce compte est rejete (optionnel)" />
                  <div className="flex gap-2">
                    <button onClick={() => traiterUtilisateur(u.id, "REJETE", motifUtilisateur)} className="bg-red-600 text-white px-3 py-1 rounded">Confirmer le rejet</button>
                    <button onClick={() => { setRejetUtilisateur(null); setMotifUtilisateur(""); }} className="bg-gray-300 px-3 py-1 rounded">Annuler</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{u.nom}</p>
                    <p className="text-sm text-gray-500">{u.email}{u.filiere ? " - " + u.filiere : ""}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => traiterUtilisateur(u.id, "VALIDE")} className="bg-green-600 text-white px-3 py-1 rounded">Valider</button>
                    <button onClick={() => setRejetUtilisateur(u.id)} className="bg-red-600 text-white px-3 py-1 rounded">Rejeter</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
