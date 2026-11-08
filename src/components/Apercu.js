"use client";
import { useState } from "react";
import Icone from "./Icone";

function PageFactice() {
  return (
    <div className="space-y-3 p-8" aria-hidden="true">
      <div className="mx-auto h-3 w-1/2 rounded bg-gray-200"></div>
      <div className="mx-auto h-2 w-1/3 rounded bg-gray-100"></div>
      <div className="pt-4"></div>
      {[100, 92, 96, 70, 88, 94, 60].map((l, i) => (
        <div key={i} className="h-2 rounded bg-gray-100" style={{ width: l + "%" }}></div>
      ))}
    </div>
  );
}

// Montre seulement le haut de la premiere page, deja recadre par le serveur :
// le reste du document n'est jamais envoye au navigateur.
export default function Apercu({ id, disponible }) {
  const [etat, setEtat] = useState(disponible ? "chargement" : "absent");

  return (
    <div className="relative overflow-hidden rounded-2xl border border-trait bg-surface">
      <div className="flex items-center justify-between border-b border-trait bg-papier px-4 py-2.5">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <Icone nom="oeil" className="h-4 w-4" /> Aperçu
        </p>
        <p className="text-xs text-gray-400">Début de la page 1</p>
      </div>

      <div className="relative min-h-56 select-none" onContextMenu={(e) => e.preventDefault()}>
        {etat !== "absent" && etat !== "erreur" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={"/api/epreuves/" + id + "/apercu"}
            alt="Aperçu du début du document"
            draggable={false}
            onLoad={() => setEtat("ok")}
            onError={() => setEtat("erreur")}
            className={"pointer-events-none block w-full transition-opacity duration-500 " + (etat === "ok" ? "opacity-100" : "opacity-0")}
          />
        )}
        {etat === "chargement" && <div className="absolute inset-0 animate-pulse bg-gray-50"></div>}
        {(etat === "absent" || etat === "erreur") && (
          <>
            <PageFactice />
            <p className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 rounded-full bg-surface px-4 py-2 text-sm text-gray-500 shadow-sm ring-1 ring-trait">
              Aperçu non disponible pour ce document
            </p>
          </>
        )}

        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-surface via-surface/85 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 pb-5 text-sm font-medium text-gray-600">
          <Icone nom="cadenas" className="h-4 w-4 text-marque-600" />
          La suite est disponible en téléchargement
        </div>
      </div>
    </div>
  );
}
