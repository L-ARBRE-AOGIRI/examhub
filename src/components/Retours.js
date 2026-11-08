"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Icone from "./Icone";

const ContexteRetours = createContext(null);

export function useRetours() {
  return useContext(ContexteRetours);
}

function FenetreConfirmation({ demande, repondre }) {
  const boutonAnnuler = useRef(null);

  useEffect(() => {
    boutonAnnuler.current?.focus();
    function surTouche(e) {
      if (e.key === "Escape") repondre(false);
    }
    window.addEventListener("keydown", surTouche);
    return () => window.removeEventListener("keydown", surTouche);
  }, [repondre]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-encre/50 backdrop-blur-sm" onClick={() => repondre(false)}></div>
      <div className="carte relative w-full max-w-md p-6 shadow-2xl animate-monter">
        <div className="flex gap-4">
          <span className={"grid h-11 w-11 shrink-0 place-items-center rounded-xl " + (demande.danger ? "bg-accent-50 text-accent-600" : "bg-marque-50 text-marque-700")}>
            <Icone nom={demande.icone || (demande.danger ? "corbeille" : "bouclier")} className="h-5 w-5" />
          </span>
          <div>
            <p className="titre-display text-xl">{demande.titre}</p>
            {demande.message && <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{demande.message}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button ref={boutonAnnuler} onClick={() => repondre(false)} className="btn btn-sm btn-blanc">Annuler</button>
          <button onClick={() => repondre(true)} className={"btn btn-sm " + (demande.danger ? "btn-danger" : "btn-primaire")}>
            {demande.bouton || "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

const STYLES_NOTIF = {
  succes: { icone: "coche", style: "bg-marque-600 text-white" },
  erreur: { icone: "croix", style: "bg-accent-600 text-white" },
  info: { icone: "etincelle", style: "bg-encre text-white" },
};

export function RetoursProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [demande, setDemande] = useState(null);
  const resolution = useRef(null);

  const notifier = useCallback((message, type = "succes") => {
    const id = Date.now() + Math.random();
    setNotifications((n) => [...n, { id, message, type }]);
    setTimeout(() => setNotifications((n) => n.filter((x) => x.id !== id)), 4000);
  }, []);

  const confirmer = useCallback((options) => {
    setDemande(options);
    return new Promise((resolve) => {
      resolution.current = resolve;
    });
  }, []);

  const repondre = useCallback((reponse) => {
    resolution.current?.(reponse);
    resolution.current = null;
    setDemande(null);
  }, []);

  return (
    <ContexteRetours.Provider value={{ notifier, confirmer }}>
      {children}
      {demande && <FenetreConfirmation demande={demande} repondre={repondre} />}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[110] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6" aria-live="polite">
        {notifications.map((n) => {
          const s = STYLES_NOTIF[n.type] || STYLES_NOTIF.info;
          return (
            <div key={n.id} className={"pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-2xl animate-monter " + s.style}>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/20">
                <Icone nom={s.icone} className="h-3.5 w-3.5" epaisseur={2.5} />
              </span>
              {n.message}
            </div>
          );
        })}
      </div>
    </ContexteRetours.Provider>
  );
}
