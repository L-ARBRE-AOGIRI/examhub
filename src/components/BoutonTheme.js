"use client";

// Script execute avant l'affichage pour eviter un flash blanc en mode sombre.
export const SCRIPT_THEME = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="sombre":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark")}catch(e){}})()`;

export default function BoutonTheme({ className = "" }) {
  function basculer() {
    const sombre = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", sombre ? "sombre" : "clair");
    } catch {}
  }

  return (
    <button
      onClick={basculer}
      className={"grid h-10 w-10 place-items-center rounded-xl text-gray-500 transition hover:bg-gray-100 hover:text-encre " + className}
      aria-label="Changer de thème (clair / sombre)"
      title="Changer de thème"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 dark:hidden" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
      </svg>
      <svg viewBox="0 0 24 24" className="hidden h-5 w-5 dark:block" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
