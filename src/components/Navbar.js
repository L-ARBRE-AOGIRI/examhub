"use client";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import Icone from "./Icone";
import BoutonTheme from "./BoutonTheme";

function initiales(texte) {
  if (!texte) return "?";
  const morceaux = texte.split(/[\s@.]+/).filter(Boolean);
  return ((morceaux[0]?.[0] || "") + (morceaux[1]?.[0] || "")).toUpperCase() || "?";
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [ouvert, setOuvert] = useState(false);
  const [defile, setDefile] = useState(false);
  const estAdminOuPlus = session?.user?.role === "SUPER_ADMIN" || session?.user?.role === "ADMIN";

  useEffect(() => {
    const surDefilement = () => setDefile(window.scrollY > 8);
    surDefilement();
    window.addEventListener("scroll", surDefilement, { passive: true });
    return () => window.removeEventListener("scroll", surDefilement);
  }, []);

  const liens = [{ href: "/epreuves", label: "Épreuves" }];
  if (status === "authenticated") {
    liens.push({ href: "/publier", label: "Publier" });
    if (estAdminOuPlus) {
      liens.push({ href: "/admin", label: "Admin" });
      liens.push({ href: "/admin/utilisateurs", label: "Utilisateurs" });
    }
  }

  function estActif(href) {
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname.startsWith(href + "/");
  }

  const nomAffiche = session?.user?.name || session?.user?.email;

  return (
    <header
      className={
        "sticky top-0 z-50 border-b transition-all duration-300 " +
        (defile || ouvert ? "border-trait bg-surface/85 backdrop-blur-xl" : "border-transparent bg-papier/60 backdrop-blur")
      }
    >
      <nav className="conteneur flex h-16 items-center justify-between gap-4">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {liens.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "rounded-lg px-3.5 py-2 text-sm font-medium transition " +
                (estActif(l.href) ? "bg-marque-50 text-marque-800" : "text-gray-600 hover:bg-gray-100 hover:text-encre")
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <BoutonTheme />
          {status === "authenticated" ? (
            <>
              <div className="flex items-center gap-2.5 rounded-full border border-trait bg-surface py-1 pl-1 pr-3.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-marque-500 to-marque-700 text-[11px] font-bold text-white">
                  {initiales(nomAffiche)}
                </span>
                <span className="max-w-[180px] truncate text-sm text-gray-600">{session.user.email}</span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="btn btn-sm btn-fantome"
                title="Déconnexion"
              >
                <Icone nom="sortie" className="h-4 w-4" />
                <span className="sr-only lg:not-sr-only">Déconnexion</span>
              </button>
            </>
          ) : status === "loading" ? (
            <span className="h-9 w-40 animate-pulse rounded-xl bg-gray-100"></span>
          ) : (
            <>
              <Link href="/connexion" className="btn btn-sm btn-fantome">Connexion</Link>
              <Link href="/inscription" className="btn btn-sm btn-primaire">
                Créer un compte
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
        <BoutonTheme />
        <button
          onClick={() => setOuvert(!ouvert)}
          className="grid h-10 w-10 place-items-center rounded-xl text-encre hover:bg-gray-100 md:hidden"
          aria-label={ouvert ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={ouvert}
        >
          <Icone nom={ouvert ? "fermer" : "menu"} className="h-6 w-6" />
        </button>
        </div>
      </nav>

      {ouvert && (
        <div className="border-t border-trait bg-surface md:hidden">
          <div className="conteneur flex flex-col gap-1 py-4">
            {liens.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOuvert(false)}
                className={
                  "rounded-xl px-4 py-3 font-medium " +
                  (estActif(l.href) ? "bg-marque-50 text-marque-800" : "text-gray-700 hover:bg-gray-50")
                }
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-trait pt-4">
              {status === "authenticated" ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-gray-500">{session.user.email}</span>
                  <button onClick={() => signOut({ callbackUrl: "/" })} className="btn btn-sm btn-danger-doux">
                    <Icone nom="sortie" className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/connexion" onClick={() => setOuvert(false)} className="btn btn-blanc">Connexion</Link>
                  <Link href="/inscription" onClick={() => setOuvert(false)} className="btn btn-primaire">Inscription</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
