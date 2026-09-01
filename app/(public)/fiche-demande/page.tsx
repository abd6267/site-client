"use client";

import { useState } from "react";
import { CheckCircle2, FileText, Printer, Send } from "lucide-react";

export default function FicheDemande() {
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState(false);
  const [reference, setReference] = useState("");
  const [erreur, setErreur] = useState("");

  async function gererEnvoi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resultat = await res.json();
      if (!res.ok) throw new Error(resultat.error);

      setReference(resultat.reference);
      setSucces(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setEnvoi(false);
    }
  }

  if (succes) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-24 text-center">
        <CheckCircle2 size={48} className="text-[var(--color-ambre-fonce)] mx-auto" />
        <h1 className="mt-6 font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
          Votre demande a été enregistrée
        </h1>
        <p className="mt-4 text-[var(--color-texte-doux)]">
          Numéro de référence :{" "}
          <span className="font-medium text-[var(--color-bleu-nuit)]">{reference}</span>
        </p>
        <div className="mt-8 p-6 bg-white border border-[var(--color-bordure)] rounded-xl text-left">
          <p className="text-sm text-[var(--color-texte-doux)] leading-relaxed">
            Un document PDF récapitulatif sera envoyé à l&apos;adresse
            e-mail renseignée. Vous devrez :
          </p>
          <ol className="mt-4 space-y-2 text-sm text-[var(--color-texte)]">
            <li className="flex items-start gap-2">
              <FileText size={16} className="mt-0.5 text-[var(--color-ambre-fonce)] shrink-0" />
              Télécharger ou recevoir le document
            </li>
            <li className="flex items-start gap-2">
              <Printer size={16} className="mt-0.5 text-[var(--color-ambre-fonce)] shrink-0" />
              L&apos;imprimer, le signer et le cacheter
            </li>
            <li className="flex items-start gap-2">
              <Send size={16} className="mt-0.5 text-[var(--color-ambre-fonce)] shrink-0" />
              Le transmettre au Cabinet BTEC BENIN
            </li>
          </ol>
        </div>
        <button
          onClick={() => setSucces(false)}
          className="mt-8 text-sm text-[var(--color-bleu-nuit)] underline"
        >
          Soumettre une nouvelle demande
        </button>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-bleu-nuit)]">
        Fiche de demande
      </h1>
      <p className="mt-4 text-[var(--color-texte-doux)] leading-relaxed">
        Vous souhaitez recruter un collaborateur ? Pour bénéficier des
        services de recrutement de BTEC BENIN, veuillez remplir
        soigneusement le formulaire ci-dessous. Après validation, un
        document PDF récapitulatif sera généré et envoyé à votre adresse
        e-mail.
      </p>

      <form onSubmit={gererEnvoi} className="mt-10 space-y-10">
        {/* A. INFORMATIONS SUR L'ENTREPRISE */}
        <div>
          <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)] pb-3 border-b border-[var(--color-bordure)]">
            A. Informations sur l&apos;entreprise
          </h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            <Champ label="Nom de l'entreprise" name="nomEntreprise" required />
            <Champ label="Numéro de téléphone" name="telephone" type="tel" required />
            <div className="sm:col-span-2">
              <Champ label="Activités ou services de l'entreprise" name="activites" required textarea />
            </div>
            <Champ label="Situation géographique" name="situationGeo" required />
            <Champ label="Adresse e-mail" name="email" type="email" required />
            <Champ label="Numéro RCCM" name="rccm" required />
            <Champ label="Numéro IFU" name="ifu" required />
          </div>
        </div>

        {/* B. INFORMATIONS SUR LE RECRUTEMENT */}
        <div>
          <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)] pb-3 border-b border-[var(--color-bordure)]">
            B. Informations sur le recrutement
          </h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            <Champ label="Poste recherché" name="posteRecherche" required />
            <Champ label="Nombre de personnes recherchées" name="nombrePersonnes" type="number" required />
            <div className="sm:col-span-2">
              <Champ label="Profil du candidat" name="profilCandidat" required textarea />
            </div>
            <Champ label="Niveau d'étude" name="niveauEtude" required />
            <Champ label="Expérience professionnelle souhaitée" name="experience" required />
            <div className="sm:col-span-2">
              <Champ label="Compétences recherchées" name="competences" required textarea />
            </div>
            <Champ label="Grille salariale" name="grilleSalariale" required />
            <Champ label="Horaire de service" name="horaireService" required />
            <Champ label="Type de contrat" name="typeContrat" required />
            <Champ label="Durée du contrat" name="dureeContrat" required />
            <Champ label="Date souhaitée de prise de fonction" name="datePriseFonction" type="date" required />
          </div>
          <div className="mt-5">
            <Champ label="Description / observations complémentaires" name="observations" textarea />
          </div>
        </div>

        {erreur && <p className="text-sm text-red-600">{erreur}</p>}

        <button
          type="submit"
          disabled={envoi}
          className="bg-[var(--color-bleu-nuit)] text-white px-8 py-3.5 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
        >
          {envoi ? "Enregistrement..." : "Enregistrer ma demande"}
        </button>
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