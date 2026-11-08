"use client";
import { useState } from "react";
import Link from "next/link";
import CadreAuth, { Spinner } from "@/components/CadreAuth";
import Icone from "@/components/Icone";

export default function MotDePasseOublie() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setEnvoi(true);
    setMessage("");

    const res = await fetch("/api/mot-de-passe-oublie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    setEnvoi(false);
    if (res.ok) {
      setSucces(true);
      setMessage(data.message);
    } else {
      setSucces(false);
      setMessage(data.erreur || "Erreur");
    }
  }

  return (
    <CadreAuth
      titre="Mot de passe oublié"
      sousTitre="Entrez votre email : nous vous enverrons un lien pour choisir un nouveau mot de passe."
      pied={
        <Link href="/connexion" className="lien inline-flex items-center gap-1.5">
          <Icone nom="retour" className="h-4 w-4" /> Retour à la connexion
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="etiquette">Adresse email</label>
          <input
            id="email"
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="champ"
            required
          />
        </div>
        {message && <p className={succes ? "alerte-succes" : "alerte-erreur"}>{message}</p>}
        <button type="submit" disabled={envoi} className="btn btn-primaire w-full">
          {envoi ? <Spinner /> : <Icone nom="courrier" className="h-4 w-4" />}
          {envoi ? "Envoi..." : "Envoyer le lien"}
        </button>
      </form>
    </CadreAuth>
  );
}
