"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";

export default function NousContacter() {
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState("");

  async function gererEnvoi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = {
      nomPrenom: formData.get("nomPrenom"),
      nomEntreprise: formData.get("nomEntreprise"),
      telephone: formData.get("telephone"),
      email: formData.get("email"),
      objet: formData.get("objet"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      setSucces(true);
      (e.target as HTMLFormElement).reset();
    } catch {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-5 gap-16">
      <div className="md:col-span-2">
        <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-bleu-nuit)]">
          Nous contacter
        </h1>
        <p className="mt-4 text-[var(--color-texte-doux)] leading-relaxed">
          Une question, un besoin de recrutement ? Notre équipe vous répond
          dans les meilleurs délais.
        </p>

        <div className="mt-10 space-y-5">
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={18} className="text-[var(--color-ambre-fonce)] shrink-0" />
            <span>Cotonou, Bénin</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={18} className="text-[var(--color-ambre-fonce)] shrink-0" />
            <span>+229 00 00 00 00</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={18} className="text-[var(--color-ambre-fonce)] shrink-0" />
            <span>contact@btecbenin.com</span>
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        {succes ? (
          <div className="bg-white border border-[var(--color-bordure)] rounded-xl p-10 text-center">
            <CheckCircle2 size={40} className="text-[var(--color-ambre-fonce)] mx-auto" />
            <p className="mt-4 text-lg text-[var(--color-bleu-nuit)] font-medium">
              Votre message a été envoyé avec succès.
            </p>
            <p className="mt-2 text-sm text-[var(--color-texte-doux)]">
              Notre équipe vous contactera dans les meilleurs délais.
            </p>
            <button
              onClick={() => setSucces(false)}
              className="mt-6 text-sm text-[var(--color-bleu-nuit)] underline"
            >
              Envoyer un autre message
            </button>
          </div>
        ) : (
          <form onSubmit={gererEnvoi} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-[var(--color-texte)]">
                  Nom et prénom *
                </label>
                <input
                  name="nomPrenom"
                  required
                  className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-texte)]">
                  Nom de l&apos;entreprise
                </label>
                <input
                  name="nomEntreprise"
                  className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-medium text-[var(--color-texte)]">
                  Numéro de téléphone *
                </label>
                <input
                  name="telephone"
                  type="tel"
                  required
                  className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)]"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[var(--color-texte)]">
                  Adresse e-mail *
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)]"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-texte)]">
                Objet du message *
              </label>
              <input
                name="objet"
                required
                className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--color-texte)]">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] resize-none"
              />
            </div>

            {erreur && (
              <p className="text-sm text-red-600">{erreur}</p>
            )}

            <button
              type="submit"
              disabled={envoi}
              className="bg-[var(--color-bleu-nuit)] text-white px-7 py-3.5 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
            >
              {envoi ? "Envoi en cours..." : "Envoyer le message"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}