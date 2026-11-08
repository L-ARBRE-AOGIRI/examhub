"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRetours } from "./Retours";

export default function BoutonFavori({ id, actif, onChange, grand = false }) {
  const { status } = useSession();
  const { notifier } = useRetours();
  const [envoi, setEnvoi] = useState(false);

  async function basculer(e) {
    e.preventDefault();
    e.stopPropagation();
    if (status !== "authenticated") {
      notifier("Connectez-vous pour ajouter des favoris", "info");
      return;
    }
    if (envoi) return;
    setEnvoi(true);
    onChange(!actif);
    try {
      const res = await fetch("/api/epreuves/" + id + "/favori", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      onChange(data.favori);
      notifier(data.favori ? "Ajouté à vos favoris" : "Retiré de vos favoris", data.favori ? "succes" : "info");
    } catch {
      onChange(actif);
      notifier("Impossible de modifier vos favoris", "erreur");
    } finally {
      setEnvoi(false);
    }
  }

  const libelle = actif ? "Retirer des favoris" : "Ajouter aux favoris";

  if (grand) {
    return (
      <button onClick={basculer} className={"btn " + (actif ? "bg-accent-50 text-accent-700 ring-1 ring-accent-200 hover:bg-accent-100" : "btn-blanc")} aria-pressed={actif}>
        <Coeur actif={actif} className="h-5 w-5" />
        {actif ? "Dans mes favoris" : "Ajouter aux favoris"}
      </button>
    );
  }

  return (
    <button
      onClick={basculer}
      className={"grid h-8 w-8 place-items-center rounded-full transition " + (actif ? "bg-accent-50 text-accent-500" : "text-gray-300 hover:bg-gray-100 hover:text-accent-500")}
      aria-label={libelle}
      aria-pressed={actif}
      title={libelle}
    >
      <Coeur actif={actif} className="h-[18px] w-[18px]" />
    </button>
  );
}

function Coeur({ actif, className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={actif ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20s-7.5-4.6-9.2-9.4C1.6 7.2 3.8 4 7.2 4c2 0 3.6 1.1 4.8 2.8C13.2 5.1 14.8 4 16.8 4c3.4 0 5.6 3.2 4.4 6.6C19.5 15.4 12 20 12 20z" />
    </svg>
  );
}

