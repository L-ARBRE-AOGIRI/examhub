"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Icone from "@/components/Icone";
import EnteteAdmin, { AccesRefuse } from "@/components/EnteteAdmin";
import { useRetours } from "@/components/Retours";

const STATUTS = {
  VALIDE: { label: "Validé", style: "bg-marque-100 text-marque-800" },
  BLOQUE: { label: "Bloqué", style: "bg-accent-100 text-accent-800" },
  REJETE: { label: "Rejeté", style: "bg-gray-200 text-gray-600" },
  EN_ATTENTE: { label: "En attente", style: "bg-amber-100 text-amber-800" },
};

function initiales(nom) {
  return (nom || "?").split(" ").filter(Boolean).slice(0, 2).map((m) => m[0]).join("").toUpperCase();
}

export default function AdminUtilisateurs() {
  const { data: session, status } = useSession();
  const { notifier, confirmer } = useRetours();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");

  const estSuperAdmin = session?.user?.role === "SUPER_ADMIN";

  async function charger() {
    const res = await fetch("/api/admin/utilisateurs");
    if (res.ok) {
      setUtilisateurs(await res.json());
    } else {
      const data = await res.json();
      setErreur("Erreur : " + (data.erreur || res.status));
    }
  }

  useEffect(() => {
    if (status === "authenticated") charger();
  }, [status]);

  async function changerStatut(id, statut, nom) {
    if (statut === "BLOQUE") {
      const ok = await confirmer({
        titre: "Bloquer " + nom + " ?",
        message: "Cette personne ne pourra plus se connecter ni publier tant que son compte restera bloqué.",
        bouton: "Bloquer",
        icone: "cadenas",
        danger: true,
      });
      if (!ok) return;
    }
    const res = await fetch("/api/utilisateurs/" + id + "/valider", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    if (!res.ok) {
      const data = await res.json();
      setErreur("Erreur : " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    notifier(statut === "BLOQUE" ? nom + " a été bloqué(e)" : nom + " a été débloqué(e)", statut === "BLOQUE" ? "info" : "succes");
    charger();
  }

  async function changerRole(id, role, nom) {
    const res = await fetch("/api/utilisateurs/" + id + "/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const data = await res.json();
      setErreur("Erreur : " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    notifier(role === "ADMIN" ? nom + " est maintenant admin" : nom + " n'est plus admin");
    charger();
  }

  async function supprimer(id, nom) {
    const ok = await confirmer({
      titre: "Supprimer " + nom + " ?",
      message: "Le compte et tous ses documents seront supprimés définitivement. Cette action est irréversible.",
      bouton: "Supprimer définitivement",
      danger: true,
    });
    if (!ok) return;
    const res = await fetch("/api/utilisateurs/" + id, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setErreur("Erreur : " + (data.erreur || res.status));
      return;
    }
    setErreur("");
    notifier(nom + " a été supprimé(e)", "info");
    charger();
  }

  if (status === "loading") return <AccesRefuse chargement />;
  if (status !== "authenticated" || (session.user.role !== "SUPER_ADMIN" && session.user.role !== "ADMIN")) {
    return <AccesRefuse />;
  }

  const texte = recherche.trim().toLowerCase();
  const affiches = utilisateurs.filter((u) =>
    !texte || [u.nom, u.email, u.filiere || ""].join(" ").toLowerCase().includes(texte)
  );

  return (
    <main className="flex-1">
      <EnteteAdmin
        titre="Utilisateurs"
        sousTitre={utilisateurs.length + " compte" + (utilisateurs.length > 1 ? "s" : "") + " inscrit" + (utilisateurs.length > 1 ? "s" : "") + " sur la plateforme."}
        actif="/admin/utilisateurs"
      />

      <div className="conteneur py-10">
        {erreur && <p className="alerte-erreur mb-5">{erreur}</p>}

        <div className="carte mb-5 flex items-center gap-3 p-2">
          <Icone nom="recherche" className="ml-3 h-5 w-5 shrink-0 text-gray-400" />
          <input
            placeholder="Rechercher par nom, email ou filière..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full bg-transparent py-2.5 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="carte divide-y divide-trait overflow-hidden">
          {affiches.length === 0 && (
            <p className="p-8 text-center text-gray-500">Aucun utilisateur trouvé.</p>
          )}
          {affiches.map((u) => {
            const s = STATUTS[u.statutCompte] || STATUTS.EN_ATTENTE;
            return (
              <div key={u.id} className="flex flex-col gap-4 p-5 transition hover:bg-papier/60 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-center gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-marque-500 to-marque-700 text-sm font-bold text-white">
                    {initiales(u.nom)}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{u.nom}</p>
                      {u.role === "SUPER_ADMIN" && <span className="pastille bg-purple-100 text-purple-700"><Icone nom="etoile" className="h-3 w-3" />Super admin</span>}
                      {u.role === "ADMIN" && <span className="pastille bg-sky-100 text-sky-700"><Icone nom="bouclier" className="h-3 w-3" />Admin</span>}
                      <span className={"pastille " + s.style}>{s.label}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-gray-500">
                      {u.email}{u.filiere ? " · " + u.filiere : ""}
                    </p>
                    <p className="text-xs text-gray-400">{u.epreuves.length} document{u.epreuves.length > 1 ? "s" : ""} publié{u.epreuves.length > 1 ? "s" : ""}</p>
                  </div>
                </div>
                {estSuperAdmin && (
                  <div className="flex shrink-0 flex-wrap gap-2 lg:justify-end">
                    {u.role === "UTILISATEUR" && (
                      <button onClick={() => changerRole(u.id, "ADMIN", u.nom)} className="btn btn-sm btn-blanc">
                        <Icone nom="promouvoir" className="h-4 w-4" /> Promouvoir admin
                      </button>
                    )}
                    {u.role === "ADMIN" && (
                      <button onClick={() => changerRole(u.id, "UTILISATEUR", u.nom)} className="btn btn-sm btn-blanc">
                        <Icone nom="retrograder" className="h-4 w-4" /> Retirer admin
                      </button>
                    )}
                    {u.statutCompte !== "BLOQUE" ? (
                      <button onClick={() => changerStatut(u.id, "BLOQUE", u.nom)} className="btn btn-sm bg-amber-50 text-amber-800 hover:bg-amber-100">
                        <Icone nom="cadenas" className="h-4 w-4" /> Bloquer
                      </button>
                    ) : (
                      <button onClick={() => changerStatut(u.id, "VALIDE", u.nom)} className="btn btn-sm btn-succes">
                        <Icone nom="cadenasOuvert" className="h-4 w-4" /> Débloquer
                      </button>
                    )}
                    <button onClick={() => supprimer(u.id, u.nom)} className="btn btn-sm btn-danger-doux">
                      <Icone nom="corbeille" className="h-4 w-4" /> Supprimer
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
