"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CadreAuth, { ChampMotDePasse, Spinner } from "@/components/CadreAuth";

export default function Connexion() {
  const router = useRouter();
  const [erreur, setErreur] = useState("");
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (chargement) return;
    setErreur("");
    setChargement(true);

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const motDePasse = formData.get("motDePasse");

    try {
      const res = await signIn("credentials", {
        email,
        motDePasse,
        redirect: false,
      });

      if (res.error) {
        setErreur(res.error);
        setChargement(false);
        return;
      }

      const session = await getSession();
      if (session?.user?.role === "SUPER_ADMIN") {
        router.push("/admin");
      } else {
        router.push("/epreuves");
      }
    } catch {
      setErreur("Une erreur est survenue. Réessayez.");
      setChargement(false);
    }
  }

  return (
    <CadreAuth
      titre="Bon retour 👋"
      sousTitre="Connectez-vous pour télécharger les épreuves et partager les vôtres."
      pied={<>Pas encore de compte ? <Link href="/inscription" className="lien">Créer un compte</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="etiquette">Adresse email</label>
          <input id="email" name="email" type="email" placeholder="vous@exemple.com" className="champ" autoComplete="email" required />
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="motDePasse" className="etiquette">Mot de passe</label>
            <Link href="/mot-de-passe-oublie" className="mb-1.5 text-sm lien">Oublié ?</Link>
          </div>
          <ChampMotDePasse
            id="motDePasse"
            name="motDePasse"
            placeholder="••••••••"
            autoComplete="current-password"
            required
            visible={voirMotDePasse}
            onBascule={() => setVoirMotDePasse(!voirMotDePasse)}
          />
        </div>
        {erreur && <p className="alerte-erreur">{erreur}</p>}
        <button type="submit" disabled={chargement} className="btn btn-primaire w-full">
          {chargement && <Spinner />}
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </CadreAuth>
  );
}
