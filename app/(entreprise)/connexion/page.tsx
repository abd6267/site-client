"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function Connexion() {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  async function gererConnexion(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const motDePasse = formData.get("motDePasse") as string;

    const resultat = await signIn("credentials", {
      email,
      motDePasse,
      redirect: false,
    });

    if (resultat?.error) {
      setErreur("Adresse e-mail ou mot de passe incorrect.");
      setEnvoi(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-bleu-nuit)]">
        Connexion
      </h1>
      <p className="mt-3 text-[var(--color-texte-doux)]">
        Accédez à votre espace entreprise BTEC BENIN.
      </p>

      <form onSubmit={gererConnexion} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-medium text-[var(--color-texte)]">
            Adresse e-mail
          </label>
          <input
            name="email"
            type="email"
            required
            className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-[var(--color-texte)]">
            Mot de passe
          </label>
          <input
            name="motDePasse"
            type="password"
            required
            className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
          />
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-[var(--color-bleu-nuit)] text-white px-8 py-3.5 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
        >
          {envoi ? "Connexion..." : "Se connecter"}
        </button>

        <p className="text-center text-sm text-[var(--color-texte-doux)]">
          Pas encore de compte ?{" "}
          <Link href="/inscription" className="text-[var(--color-bleu-nuit)] font-medium">
            Créer un compte entreprise
          </Link>
        </p>
      </form>
    </section>
  );
}