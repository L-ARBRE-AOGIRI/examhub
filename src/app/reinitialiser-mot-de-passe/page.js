"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import CadreAuth, { ChampMotDePasse, Spinner } from "@/components/CadreAuth";

function FormulaireReinitialisation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [motDePasse, setMotDePasse] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [voirMotDePasse, setVoirMotDePasse] = useState(false);
  const [message, setMessage] = useState("");
  const [succes, setSucces] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (motDePasse !== confirmation) {
      setSucces(false);
      setMessage("Les deux mots de passe ne correspondent pas");
      return;
    }

    setEnvoi(true);
    setMessage("");

    const res = await fetch("/api/reinitialiser-mot-de-passe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, motDePasse }),
    });
    const data = await res.json();

    setEnvoi(false);
    if (res.ok) {
      setSucces(true);
      setMessage("Mot de passe mis à jour ! Redirection...");
      setTimeout(() => router.push("/connexion"), 2000);
    } else {
      setSucces(false);
      setMessage(data.erreur || "Erreur");
    }
  }

  if (!token) {
    return (
      <div className="space-y-5">
        <p className="alerte-erreur">Lien invalide. Refaites une demande depuis la page « Mot de passe oublié ».</p>
        <Link href="/mot-de-passe-oublie" className="btn btn-primaire w-full">Refaire une demande</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="nouveau" className="etiquette">Nouveau mot de passe</label>
        <ChampMotDePasse
          id="nouveau"
          placeholder="Nouveau mot de passe"
          value={motDePasse}
          onChange={(e) => setMotDePasse(e.target.value)}
          autoComplete="new-password"
          required
          visible={voirMotDePasse}
          onBascule={() => setVoirMotDePasse(!voirMotDePasse)}
        />
      </div>
      <div>
        <label htmlFor="confirmation" className="etiquette">Confirmer le mot de passe</label>
        <input
          id="confirmation"
          type={voirMotDePasse ? "text" : "password"}
          placeholder="Retapez le mot de passe"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          className="champ"
          autoComplete="new-password"
          required
        />
      </div>
      {message && <p className={succes ? "alerte-succes" : "alerte-erreur"}>{message}</p>}
      <button type="submit" disabled={envoi} className="btn btn-primaire w-full">
        {envoi && <Spinner />}
        {envoi ? "Mise à jour..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}

export default function ReinitialiserMotDePasse() {
  return (
    <CadreAuth titre="Nouveau mot de passe" sousTitre="Choisissez un nouveau mot de passe pour votre compte.">
      <Suspense fallback={<p className="text-gray-500">Chargement...</p>}>
        <FormulaireReinitialisation />
      </Suspense>
    </CadreAuth>
  );
}
