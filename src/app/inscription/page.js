"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FILIERES } from "@/lib/constantes";
import CadreAuth, { ChampMotDePasse, Spinner } from "@/components/CadreAuth";

export default function Inscription() {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState(false);
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [chargement, setChargement] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (chargement) return;
    setMessage("");
    setChargement(true);

    const formData = new FormData(e.target);
    const nom = formData.get("nom");
    const email = formData.get("email");
    const motDePasse = formData.get("motDePasse");
    const filiere = formData.get("filiere");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, email, motDePasse, filiere }),
      });
      const data = await res.json();

      if (res.ok) {
        setSucces(true);
        setMessage("Compte créé ! Connexion automatique...");
        await signIn("credentials", { email, motDePasse, redirect: false });
        router.push("/epreuves");
      } else {
        setSucces(false);
        setMessage(data.erreur || "Erreur lors de la création du compte");
        setChargement(false);
      }
    } catch {
      setSucces(false);
      setMessage("Une erreur est survenue. Réessayez.");
      setChargement(false);
    }
  }

  return (
    <CadreAuth
      titre="Créer un compte"
      sousTitre="Rejoignez la communauté et accédez gratuitement à toutes les ressources."
      pied={<>Déjà inscrit ? <Link href="/connexion" className="lien">Se connecter</Link></>}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="nom" className="etiquette">Nom complet</label>
          <input id="nom" name="nom" placeholder="Prénom Nom" className="champ" autoComplete="name" required />
        </div>
        <div>
          <label htmlFor="email" className="etiquette">Adresse email</label>
          <input id="email" name="email" type="email" placeholder="vous@exemple.com" className="champ" autoComplete="email" required />
        </div>
        <div>
          <label htmlFor="filiere" className="etiquette">Votre filière à HECM</label>
          <select id="filiere" name="filiere" className="champ" required defaultValue="">
            <option value="" disabled>Choisir une filière</option>
            {FILIERES.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="motDePasse" className="etiquette">Mot de passe</label>
          <ChampMotDePasse
            id="motDePasse"
            name="motDePasse"
            placeholder="Choisissez un mot de passe"
            autoComplete="new-password"
            required
            visible={voirMotDePasse}
            onBascule={() => setVoirMotDePasse(!voirMotDePasse)}
          />
        </div>
        {message && <p className={succes ? "alerte-succes" : "alerte-erreur"}>{message}</p>}
        <button type="submit" disabled={chargement} className="btn btn-primaire w-full">
          {chargement && <Spinner />}
          {chargement ? "Création du compte..." : "Créer mon compte"}
        </button>
      </form>
    </CadreAuth>
  );
}
