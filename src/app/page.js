import Link from "next/link";
import Icone from "@/components/Icone";
import {
  FILIERES_LICENCE_TERTIAIRES,
  FILIERES_LICENCE_INDUSTRIELLES,
  FILIERES_LICENCE,
  FILIERES_MASTER,
} from "@/lib/constantes";

function Pastilles({ liste, accent }) {
  return (
    <div className="flex flex-wrap gap-2">
      {liste.map((f) => (
        <Link
          key={f}
          href={"/epreuves?filiere=" + encodeURIComponent(f)}
          className={
            "group inline-flex items-center gap-1.5 rounded-full border bg-surface px-4 py-2 text-sm font-medium transition duration-200 hover:-translate-y-0.5 hover:shadow-md " +
            (accent
              ? "border-accent-200 text-accent-800 hover:border-accent-500 hover:bg-accent-500 hover:text-white"
              : "border-marque-200 text-marque-800 hover:border-marque-600 hover:bg-marque-600 hover:text-white")
          }
        >
          {f}
          <Icone nom="fleche" className="h-3.5 w-0 opacity-0 transition-all duration-200 group-hover:w-3.5 group-hover:opacity-100" />
        </Link>
      ))}
    </div>
  );
}

function CarteDecor({ type, couleur, titre, meta, className, rotation }) {
  return (
    <div
      className={"absolute w-64 rounded-2xl bg-surface p-4 text-encre shadow-[0_20px_50px_-12px_rgba(0,0,0,0.45)] animate-flotter " + className}
      style={{ "--r": rotation }}
    >
      <div className="flex items-center justify-between">
        <span className={"pastille " + couleur}>{type}</span>
        <Icone nom="document" className="h-4 w-4 text-gray-300" />
      </div>
      <p className="mt-3 font-semibold leading-snug">{titre}</p>
      <p className="mt-1 text-xs text-gray-500">{meta}</p>
      <div className="mt-4 space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-gray-100"></div>
        <div className="h-1.5 w-4/5 rounded-full bg-gray-100"></div>
        <div className="h-1.5 w-3/5 rounded-full bg-gray-100"></div>
      </div>
    </div>
  );
}

export default function Home() {
  const parcours = [
    { label: "Licence", detail: "Licence 1, 2 et 3", niveau: "LICENCE_1", icone: "livre", style: "from-marque-500 to-marque-700" },
    { label: "Master", detail: "Master 1 et 2", niveau: "MASTER_1", icone: "diplome", style: "from-marque-700 to-marque-950" },
    { label: "Concours", detail: "Annales de concours", niveau: "CONCOURS", icone: "trophee", style: "from-accent-400 to-accent-600" },
    { label: "Examen national", detail: "Sujets des examens nationaux", niveau: "EXAMEN_NATIONAL", icone: "drapeau", style: "from-accent-600 to-accent-900" },
  ];

  const stats = [
    { chiffre: String(FILIERES_LICENCE.length), label: "Filières de Licence" },
    { chiffre: String(FILIERES_MASTER.length), label: "Filières de Master" },
    { chiffre: "5", label: "Niveaux, de L1 à M2" },
    { chiffre: "100%", label: "Gratuit, pour toujours" },
  ];

  const atouts = [
    { icone: "filtre", titre: "Recherche par filière", texte: "Filtrez par filière, niveau, matière et année pour trouver exactement le document dont vous avez besoin." },
    { icone: "bouclier", titre: "Contenu vérifié", texte: "Chaque document est examiné par un administrateur avant d'être publié. Pas de doublons, pas de fichiers vides." },
    { icone: "groupe", titre: "Communauté active", texte: "Les étudiants partagent leurs épreuves : la banque de ressources grandit un peu plus chaque semaine." },
  ];

  const etapes = [
    { n: "01", titre: "Créez votre compte", texte: "Inscription gratuite en 30 secondes avec votre filière." },
    { n: "02", titre: "Trouvez vos sujets", texte: "Parcourez les épreuves par niveau, matière ou année." },
    { n: "03", titre: "Partagez à votre tour", texte: "Publiez vos documents pour aider les promotions suivantes." },
  ];

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="relative overflow-hidden bg-marque-950 text-white">
        <div className="grille-points absolute inset-0 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"></div>
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-marque-500/30 blur-[120px]"></div>
        <div className="absolute -right-20 bottom-0 h-[400px] w-[400px] rounded-full bg-accent-500/20 blur-[120px]"></div>

        <div className="conteneur relative grid items-center gap-12 py-20 lg:grid-cols-[1.15fr_1fr] lg:py-28">
          <div className="animate-monter">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-sm text-marque-100 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-marque-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-marque-400"></span>
              </span>
              Haute École de Commerce et de Management
            </span>

            <h1 className="titre-display mt-6 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl">
              Toutes les épreuves de HECM,{" "}
              <span className="relative whitespace-nowrap text-marque-300">
                au même endroit
                <svg className="absolute -bottom-2 left-0 w-full text-accent-500" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M2 9C60 3 140 2 298 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
              .
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-marque-100/80">
              Épreuves, cours, exercices, concours et examens nationaux, classés par filière — de la Licence 1 au Master 2.
            </p>

            <form action="/epreuves" method="get" className="mt-9 flex max-w-xl flex-col gap-2 rounded-2xl bg-surface p-2 shadow-2xl shadow-black/30 sm:flex-row">
              <label className="flex flex-1 items-center gap-3 px-3">
                <Icone nom="recherche" className="h-5 w-5 shrink-0 text-gray-400" />
                <input
                  name="q"
                  placeholder="Ex. : Comptabilité générale 2023"
                  className="w-full bg-transparent py-3 text-encre outline-none placeholder:text-gray-400"
                  aria-label="Rechercher une épreuve"
                />
              </label>
              <button type="submit" className="btn btn-primaire">
                Rechercher
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-marque-100/70">
              <Link href="/epreuves" className="group inline-flex items-center gap-1.5 font-semibold text-white">
                Parcourir toutes les épreuves
                <Icone nom="fleche" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/inscription" className="hover:text-white">Créer un compte gratuit</Link>
            </div>
          </div>

          <div className="relative hidden h-[440px] lg:block" aria-hidden="true">
            <CarteDecor
              type="Épreuve"
              couleur="bg-marque-100 text-marque-700"
              titre="Comptabilité générale — Session normale"
              meta="Licence 1 · Finance Comptabilité et Audit · 2024"
              className="left-6 top-4"
              rotation="-6deg"
            />
            <CarteDecor
              type="Concours"
              couleur="bg-accent-100 text-accent-700"
              titre="Culture générale & Mathématiques"
              meta="Concours · 2023"
              className="right-0 top-36 [animation-delay:1.2s]"
              rotation="5deg"
            />
            <CarteDecor
              type="Cours"
              couleur="bg-sky-100 text-sky-700"
              titre="Algorithmique et structures de données"
              meta="Licence 2 · Génie Informatique · 2024"
              className="bottom-0 left-16 [animation-delay:2.4s]"
              rotation="-2deg"
            />
            <div className="absolute right-10 top-0 flex items-center gap-2 rounded-full bg-marque-500 px-3 py-1.5 text-xs font-semibold shadow-lg animate-flotter [animation-delay:0.6s]">
              <Icone nom="coche" className="h-3.5 w-3.5" epaisseur={2.5} />
              Validé par un admin
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="conteneur relative z-10 -mt-10">
        <div className="carte grid grid-cols-2 divide-trait p-2 shadow-xl shadow-marque-950/5 sm:grid-cols-4 sm:divide-x">
          {stats.map((s) => (
            <div key={s.label} className="px-4 py-5 text-center">
              <p className="titre-display text-3xl text-marque-700 sm:text-4xl">{s.chiffre}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ATOUTS */}
      <section className="conteneur py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">Pourquoi ExamHECM</p>
          <h2 className="titre-display mt-3 text-4xl sm:text-5xl">Réviser avec les bons sujets, enfin simple.</h2>
          <p className="mt-4 text-lg text-gray-500">Un espace pensé pour les étudiants de HECM, alimenté par la communauté.</p>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {atouts.map((a, i) => (
            <div key={a.titre} className="carte group relative overflow-hidden p-8 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-marque-950/5">
              <span className="absolute right-6 top-5 titre-display text-6xl text-gray-100 transition group-hover:text-marque-50">{i + 1}</span>
              <span className={"relative grid h-12 w-12 place-items-center rounded-2xl " + (i === 1 ? "bg-accent-50 text-accent-600" : "bg-marque-50 text-marque-700")}>
                <Icone nom={a.icone} className="h-6 w-6" />
              </span>
              <h3 className="relative mt-6 text-lg font-bold">{a.titre}</h3>
              <p className="relative mt-2 leading-relaxed text-gray-500">{a.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PARCOURS */}
      <section className="conteneur pb-24">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">Tous les parcours</p>
            <h2 className="titre-display mt-3 text-4xl">Choisissez votre niveau</h2>
          </div>
          <Link href="/epreuves" className="lien inline-flex items-center gap-1.5">
            Voir tout <Icone nom="fleche" className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {parcours.map((p) => (
            <Link
              key={p.label}
              href={"/epreuves?niveau=" + p.niveau}
              className={"group relative flex min-h-48 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white transition duration-300 hover:-translate-y-1 hover:shadow-2xl " + p.style}
            >
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-125"></div>
              <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/15 backdrop-blur">
                <Icone nom={p.icone} className="h-5 w-5" />
              </span>
              <div className="relative">
                <p className="titre-display text-2xl">{p.label}</p>
                <p className="mt-1 flex items-center justify-between text-sm text-white/75">
                  {p.detail}
                  <Icone nom="fleche" className="h-4 w-4 -translate-x-2 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FILIERES */}
      <section className="border-y border-trait bg-surface py-24">
        <div className="conteneur">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">Les filières</p>
            <h2 className="titre-display mt-3 text-4xl sm:text-5xl">Trouvez votre filière</h2>
            <p className="mt-4 text-lg text-gray-500">Cliquez sur une filière pour voir directement ses documents.</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-papier p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="titre-display text-2xl">Licences professionnelles</h3>
                <span className="pastille bg-marque-100 text-marque-800">Bac+3</span>
              </div>
              <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Filières tertiaires</p>
              <Pastilles liste={FILIERES_LICENCE_TERTIAIRES} />
              <p className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wider text-gray-500">Filières industrielles</p>
              <Pastilles liste={FILIERES_LICENCE_INDUSTRIELLES} />
            </div>
            <div className="rounded-3xl bg-papier p-8">
              <div className="flex items-baseline justify-between">
                <h3 className="titre-display text-2xl">Masters</h3>
                <span className="pastille bg-accent-100 text-accent-800">Bac+5</span>
              </div>
              <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-wider text-gray-500">Toutes les filières</p>
              <Pastilles liste={FILIERES_MASTER} accent />
            </div>
          </div>
        </div>
      </section>

      {/* ETAPES */}
      <section className="conteneur py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-accent-600">Comment ça marche</p>
          <h2 className="titre-display mt-3 text-4xl">Trois étapes, c&apos;est tout.</h2>
        </div>
        <div className="relative mt-14 grid gap-8 md:grid-cols-3">
          <div className="absolute left-[16%] right-[16%] top-7 hidden h-px border-t-2 border-dashed border-marque-200 md:block"></div>
          {etapes.map((e) => (
            <div key={e.n} className="relative text-center">
              <span className="titre-display mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-marque-600 text-lg text-white shadow-lg shadow-marque-600/30 ring-8 ring-papier">
                {e.n}
              </span>
              <h3 className="mt-5 text-lg font-bold">{e.titre}</h3>
              <p className="mx-auto mt-2 max-w-xs text-gray-500">{e.texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="conteneur pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-marque-600 px-8 py-16 text-center text-white sm:px-16">
          <div className="grille-points absolute inset-0 opacity-60"></div>
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-marque-400/50 blur-3xl"></div>
          <div className="absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-accent-500/40 blur-3xl"></div>
          <div className="relative">
            <h2 className="titre-display mx-auto max-w-2xl text-4xl sm:text-5xl">Prêt à réviser plus intelligemment ?</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-marque-50/90">
              Créez votre compte gratuitement et accédez à toute la banque de ressources. Vous pourrez aussi partager vos propres documents.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/inscription" className="btn bg-white text-[#00552B] shadow-xl hover:bg-[#EFFAF4]">
                Créer mon compte
                <Icone nom="fleche" className="h-4 w-4" />
              </Link>
              <Link href="/connexion" className="btn border border-white/30 text-white hover:bg-white/10">
                J&apos;ai déjà un compte
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
