import Link from "next/link";
import Icone from "@/components/Icone";

export const metadata = {
  title: "Page introuvable — ExamHECM",
};

export default function PageIntrouvable() {
  return (
    <main className="conteneur flex flex-1 flex-col items-center justify-center py-24 text-center">
      <div className="relative">
        <p className="titre-display select-none text-[9rem] leading-none text-marque-600/10 sm:text-[12rem]">404</p>
        <span className="absolute inset-0 m-auto grid h-20 w-20 place-items-center rounded-3xl bg-marque-600 text-white shadow-xl shadow-marque-600/30 animate-flotter">
          <Icone nom="document" className="h-10 w-10" />
        </span>
      </div>
      <h1 className="titre-display mt-6 text-4xl">Cette page s&apos;est perdue entre deux copies</h1>
      <p className="mt-3 max-w-md text-gray-500">
        Le lien est peut-être erroné, ou le document a été retiré. Pas de panique, les épreuves sont toujours là.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/epreuves" className="btn btn-primaire">
          <Icone nom="recherche" className="h-4 w-4" />
          Parcourir les épreuves
        </Link>
        <Link href="/" className="btn btn-blanc">Retour à l&apos;accueil</Link>
      </div>
    </main>
  );
}
