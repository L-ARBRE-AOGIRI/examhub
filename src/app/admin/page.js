"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { NIVEAUX, NIVEAUX_ACADEMIQUES, filieresPourNiveau, LABELS_NIVEAU, LABELS_TYPE, COULEURS_TYPE, TYPES_DOCUMENT } from "@/lib/constantes";
import Icone from "@/components/Icone";
import EnteteAdmin, { AccesRefuse } from "@/components/EnteteAdmin";
import { useRetours } from "@/components/Retours";

function Vide({ texte }) {
  return (
    <div className="carte flex items-center gap-4 border-dashed p-6 text-gray-500">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-marque-50 text-marque-600">
        <Icone nom="coche" className="h-5 w-5" epaisseur={2.5} />
      </span>
      {texte}
    </div>
  );
}

function initiales(nom) {
  return (nom || "?").split(" ").filter(Boolean).slice(0, 2).map((m) => m[0]).join("").toUpperCase();
}

export default function Admin() {
  const { data: session, status } = useSession();
  const { notifier } = useRetours();
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
      setErreur("Erreur de chargement : " + (data.erreur || res.status));
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
      setErreur("Erreur : " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    setRejetEpreuve(null);
    setMotifEpreuve("");
    notifier(statut === "VALIDEE" ? "Document validé et publié" : "Document rejeté", statut === "VALIDEE" ? "succes" : "info");
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
      setErreur("Erreur : " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    setRejetUtilisateur(null);
    setMotifUtilisateur("");
    notifier(statut === "VALIDE" ? "Compte validé" : "Compte rejeté", statut === "VALIDE" ? "succes" : "info");
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
      setErreur("Erreur : " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    setEdition(null);
    notifier("Modifications enregistrées");
    charger();
  }

  if (status === "loading") return <AccesRefuse chargement />;
  if (status !== "authenticated" || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return <AccesRefuse />;
  }

  const stats = [
    { label: "Épreuves à valider", valeur: epreuves.length, icone: "document" },
    { label: "Comptes à valider", valeur: utilisateurs.length, icone: "utilisateur" },
  ];

  return (
    <main className="flex-1">
      <EnteteAdmin titre="Tableau de bord" sousTitre="Validez les documents et les comptes en attente." actif="/admin">
        <div className="mt-8 grid max-w-xl grid-cols-2 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
              <div className="flex items-center justify-between text-marque-200">
                <span className="text-sm">{s.label}</span>
                <Icone nom={s.icone} className="h-4 w-4" />
              </div>
              <p className="titre-display mt-1 text-3xl">{s.valeur}</p>
            </div>
          ))}
        </div>
      </EnteteAdmin>

      <div className="conteneur space-y-12 py-10">
        {erreur && <p className="alerte-erreur">{erreur}</p>}

        <section>
          <h2 className="titre-display mb-5 flex items-center gap-3 text-2xl">
            Épreuves en attente
            <span className="pastille bg-amber-100 text-amber-800">{epreuves.length}</span>
          </h2>
          {epreuves.length === 0 && <Vide texte="Tout est à jour, aucune épreuve à valider." />}
          <div className="space-y-3">
            {epreuves.map((ep) => (
              <div key={ep.id} className="carte p-5">
                {edition === ep.id ? (
                  <div className="space-y-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-marque-700">
                      <Icone nom="crayon" className="h-4 w-4" /> Modifier le document
                    </p>
                    <input className="champ" value={formEdition.titre} onChange={(e) => setFormEdition({ ...formEdition, titre: e.target.value })} placeholder="Titre" />
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input className="champ" value={formEdition.matiere} onChange={(e) => setFormEdition({ ...formEdition, matiere: e.target.value })} placeholder="Matière" />
                      <input className="champ" type="number" value={formEdition.annee} onChange={(e) => setFormEdition({ ...formEdition, annee: e.target.value })} placeholder="Année" />
                      <select className="champ" value={formEdition.type} onChange={(e) => setFormEdition({ ...formEdition, type: e.target.value })}>
                        {TYPES_DOCUMENT.map((t) => (
                          <option key={t.valeur} value={t.valeur}>{t.label}</option>
                        ))}
                      </select>
                      <select className="champ" value={formEdition.niveau} onChange={(e) => setFormEdition({ ...formEdition, niveau: e.target.value })}>
                        {NIVEAUX.map((n) => (
                          <option key={n.valeur} value={n.valeur}>{n.label}</option>
                        ))}
                      </select>
                      {NIVEAUX_ACADEMIQUES.includes(formEdition.niveau) ? (
                        <select className="champ sm:col-span-2" value={formEdition.filiere} onChange={(e) => setFormEdition({ ...formEdition, filiere: e.target.value })}>
                          <option value="">Choisir la filière</option>
                          {filieresPourNiveau(formEdition.niveau).map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      ) : (
                        <input className="champ sm:col-span-2" value="Filière non requise" disabled />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => enregistrerEdition(ep.id)} className="btn btn-sm btn-primaire">
                        <Icone nom="coche" className="h-4 w-4" /> Enregistrer
                      </button>
                      <button onClick={() => setEdition(null)} className="btn btn-sm btn-blanc">Annuler</button>
                    </div>
                  </div>
                ) : rejetEpreuve === ep.id ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Motif du rejet pour « {ep.titre} »</p>
                    <textarea className="champ" rows="3" value={motifEpreuve} onChange={(e) => setMotifEpreuve(e.target.value)} placeholder="Expliquez pourquoi cette épreuve est rejetée (optionnel)" />
                    <div className="flex gap-2">
                      <button onClick={() => traiterEpreuve(ep.id, "REJETEE", motifEpreuve)} className="btn btn-sm btn-danger">Confirmer le rejet</button>
                      <button onClick={() => { setRejetEpreuve(null); setMotifEpreuve(""); }} className="btn btn-sm btn-blanc">Annuler</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex min-w-0 gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marque-50 text-marque-700">
                        <Icone nom="document" className="h-6 w-6" />
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={"pastille " + (COULEURS_TYPE[ep.type] || "bg-gray-100 text-gray-700")}>{LABELS_TYPE[ep.type] || ep.type}</span>
                          <p className="font-semibold">{ep.titre}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{LABELS_NIVEAU[ep.niveau] || ep.niveau} · {ep.matiere}{ep.filiere ? " · " + ep.filiere : ""}</p>
                        <p className="mt-0.5 text-sm text-gray-400">Par {ep.auteur?.nom} ({ep.auteur?.email})</p>
                        <a href={ep.fichierUrl} target="_blank" rel="noopener noreferrer" className="lien mt-1 inline-flex items-center gap-1 text-sm">
                          <Icone nom="oeil" className="h-4 w-4" /> Voir le fichier
                        </a>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <button onClick={() => ouvrirEdition(ep)} className="btn btn-sm btn-blanc">
                        <Icone nom="crayon" className="h-4 w-4" /> Modifier
                      </button>
                      <button onClick={() => traiterEpreuve(ep.id, "VALIDEE")} className="btn btn-sm btn-succes">
                        <Icone nom="coche" className="h-4 w-4" epaisseur={2.5} /> Valider
                      </button>
                      <button onClick={() => setRejetEpreuve(ep.id)} className="btn btn-sm btn-danger-doux">
                        <Icone nom="croix" className="h-4 w-4" /> Rejeter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="titre-display mb-5 flex items-center gap-3 text-2xl">
            Comptes en attente
            <span className="pastille bg-amber-100 text-amber-800">{utilisateurs.length}</span>
          </h2>
          {utilisateurs.length === 0 && <Vide texte="Aucun compte en attente de validation." />}
          <div className="grid gap-3 md:grid-cols-2">
            {utilisateurs.map((u) => (
              <div key={u.id} className="carte p-5">
                {rejetUtilisateur === u.id ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Motif du rejet pour « {u.nom} »</p>
                    <textarea className="champ" rows="3" value={motifUtilisateur} onChange={(e) => setMotifUtilisateur(e.target.value)} placeholder="Expliquez pourquoi ce compte est rejeté (optionnel)" />
                    <div className="flex gap-2">
                      <button onClick={() => traiterUtilisateur(u.id, "REJETE", motifUtilisateur)} className="btn btn-sm btn-danger">Confirmer le rejet</button>
                      <button onClick={() => { setRejetUtilisateur(null); setMotifUtilisateur(""); }} className="btn btn-sm btn-blanc">Annuler</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-marque-500 to-marque-700 text-sm font-bold text-white">
                        {initiales(u.nom)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{u.nom}</p>
                        <p className="truncate text-sm text-gray-500">{u.email}</p>
                        {u.filiere && <p className="truncate text-xs text-gray-400">{u.filiere}</p>}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button onClick={() => traiterUtilisateur(u.id, "VALIDE")} className="btn btn-sm btn-succes" title="Valider">
                        <Icone nom="coche" className="h-4 w-4" epaisseur={2.5} />
                        <span className="hidden sm:inline">Valider</span>
                      </button>
                      <button onClick={() => setRejetUtilisateur(u.id)} className="btn btn-sm btn-danger-doux" title="Rejeter">
                        <Icone nom="croix" className="h-4 w-4" />
                        <span className="hidden sm:inline">Rejeter</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
