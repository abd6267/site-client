"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function Inscription() {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [succes, setSucces] = useState(false);
  const [accepteConditions, setAccepteConditions] = useState(false);

  async function gererEnvoi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErreur("");

    if (!accepteConditions) {
      setErreur("Vous devez accepter les conditions générales d'utilisation.");
      return;
    }

    setEnvoi(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/entreprises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resultat = await res.json();
      if (!res.ok) throw new Error(resultat.error);

      setSucces(true);
      setTimeout(() => router.push("/connexion"), 3000);
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setEnvoi(false);
    }
  }

  if (succes) {
    return (
      <section className="max-w-lg mx-auto px-6 py-24 text-center">
        <CheckCircle2 size={48} className="text-[var(--color-ambre-fonce)] mx-auto" />
        <h1 className="mt-6 font-[var(--font-display)] text-2xl text-[var(--color-bleu-nuit)]">
          Compte créé avec succès
        </h1>
        <p className="mt-4 text-[var(--color-texte-doux)]">
          Votre compte est en attente de validation par notre équipe. Vous
          serez redirigé vers la page de connexion.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-bleu-nuit)]">
        Compte Entreprise
      </h1>
      <p className="mt-3 text-[var(--color-texte-doux)]">
        Créez votre compte pour accéder à nos services de recrutement et à
        la BTEC CVTHÈQUE.
      </p>

      <form onSubmit={gererEnvoi} className="mt-8 space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Champ label="Nom de l'entreprise" name="nomEntreprise" required />
          <Champ label="Nom du promoteur" name="nomPromoteur" required />
        </div>

        <Champ label="Activités ou services de l'entreprise" name="activites" required textarea />

        <div className="grid sm:grid-cols-2 gap-5">
          <Champ label="Situation géographique" name="situationGeo" required />
          <Champ label="Numéro de téléphone" name="telephone" type="tel" required />
          <Champ label="Numéro RCCM" name="rccm" required />
          <Champ label="Numéro IFU" name="ifu" required />
        </div>

        <Champ label="Adresse e-mail" name="email" type="email" required />

        <div className="grid sm:grid-cols-2 gap-5">
          <Champ label="Mot de passe" name="motDePasse" type="password" required />
          <Champ label="Confirmation du mot de passe" name="confirmationMotDePasse" type="password" required />
        </div>

        <label className="flex items-start gap-3 text-sm text-[var(--color-texte-doux)]">
          <input
            type="checkbox"
            checked={accepteConditions}
            onChange={(e) => setAccepteConditions(e.target.checked)}
            className="mt-1"
          />
          J&apos;accepte les Conditions générales d&apos;utilisation et la
          Politique de confidentialité de BTEC BENIN.
        </label>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="w-full bg-[var(--color-bleu-nuit)] text-white px-8 py-3.5 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
        >
          {envoi ? "Création du compte..." : "Créer mon compte"}
        </button>

        <p className="text-center text-sm text-[var(--color-texte-doux)]">
          Déjà un compte ?{" "}
          <Link href="/connexion" className="text-[var(--color-bleu-nuit)] font-medium">
            Se connecter
          </Link>
        </p>
      </form>
    </section>
  );
}

function Champ({
  label,
  name,
  type = "text",
  required = false,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-[var(--color-texte)]">
        {label} {required && "*"}
      </label>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={3}
          className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] resize-none bg-white"
        />
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
        />
      )}
    </div>
  );
}