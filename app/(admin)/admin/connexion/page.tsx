"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ShieldCheck } from "lucide-react";

export default function ConnexionAdmin() {
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
      setErreur("Identifiants incorrects.");
      setEnvoi(false);
      return;
    }

    const reponseSession = await fetch("/api/auth/session");
    const session = await reponseSession.json();

    if (session?.user?.role !== "ADMIN") {
      setErreur("Ce compte n'a pas accès au back-office.");
      setEnvoi(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <section className="max-w-md mx-auto px-6 py-24">
      <div className="flex items-center gap-2 text-[var(--color-bleu-nuit)]">
        <ShieldCheck size={22} />
        <span className="text-sm font-medium">Espace administrateur</span>
      </div>
      <h1 className="mt-3 font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Connexion BTEC
      </h1>

      <form onSubmit={gererConnexion} className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-medium text-[var(--color-texte)]">
            Identifiant
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
      </form>
    </section>
  );
}