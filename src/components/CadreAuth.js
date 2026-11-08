import Icone from "./Icone";

export function Spinner({ clair = true }) {
  return (
    <span
      className={
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-t-transparent " +
        (clair ? "border-white" : "border-marque-600")
      }
    ></span>
  );
}

export function ChampMotDePasse({ visible, onBascule, ...props }) {
  return (
    <div className="relative">
      <input type={visible ? "text" : "password"} className="champ pr-12" {...props} />
      <button
        type="button"
        onClick={onBascule}
        className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label={visible ? "Cacher le mot de passe" : "Voir le mot de passe"}
      >
        <Icone nom={visible ? "oeilBarre" : "oeil"} className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function CadreAuth({ titre, sousTitre, children, pied }) {
  const points = [
    "Sujets classés par filière et par niveau",
    "Contenu vérifié par les administrateurs",
    "100% gratuit pour les étudiants de HECM",
  ];

  return (
    <main className="flex-1 bg-papier">
      <div className="conteneur grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-2 lg:py-16">
        <div className="relative hidden h-full max-h-[760px] min-h-[560px] overflow-hidden rounded-[2rem] bg-marque-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="grille-points absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)]"></div>
          <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-marque-500/40 blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent-500/25 blur-[100px]"></div>

          <div className="relative">
            <span className="pastille bg-white/10 text-marque-100">ExamHECM</span>
            <h2 className="titre-display mt-6 text-5xl leading-[1.05]">
              Révisez avec les <span className="text-marque-300">vrais sujets</span> de vos aînés.
            </h2>
          </div>

          <ul className="relative space-y-4">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-marque-50/90">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-marque-500/25 text-marque-300">
                  <Icone nom="coche" className="h-4 w-4" epaisseur={2.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto w-full max-w-md animate-monter">
          <div className="mb-8">
            <h1 className="titre-display text-4xl">{titre}</h1>
            {sousTitre && <p className="mt-3 text-gray-500">{sousTitre}</p>}
          </div>
          {children}
          {pied && <div className="mt-8 text-center text-sm text-gray-500">{pied}</div>}
        </div>
      </div>
    </main>
  );
}
