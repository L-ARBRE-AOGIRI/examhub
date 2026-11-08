import Link from "next/link";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="mt-auto bg-marque-950 text-marque-100/70">
      <div className="conteneur grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo clair />
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            La banque d&apos;épreuves, de cours et d&apos;annales des étudiants de la Haute École de Commerce et de Management. Gratuite, vérifiée, alimentée par la communauté.
          </p>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Explorer</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/epreuves" className="hover:text-white">Toutes les épreuves</Link></li>
            <li><Link href="/publier" className="hover:text-white">Partager un document</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-semibold text-white">Mon compte</p>
          <ul className="space-y-2 text-sm">
            <li><Link href="/connexion" className="hover:text-white">Connexion</Link></li>
            <li><Link href="/inscription" className="hover:text-white">Créer un compte</Link></li>
            <li><Link href="/mot-de-passe-oublie" className="hover:text-white">Mot de passe oublié</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="conteneur flex flex-col gap-2 py-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ExamHECM. Fait par et pour les étudiants de HECM.</p>
          <p className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-marque-400"></span>
            Chaque document est vérifié avant publication
          </p>
        </div>
      </div>
    </footer>
  );
}
