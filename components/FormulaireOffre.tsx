"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DonneesOffre = {
  intitulePoste: string;
  entrepriseNom: string;
  afficherNom: boolean;
  localisation: string;
  typeContrat: string;
  niveauEtude: string;
  experience: string;
  salaire: string;
  description: string;
  missions: string;
  profilRecherche: string;
  competences: string;
  statut: string;
  dateExpiration: string;
};

export default function FormulaireOffre({
  offreExistante,
  offreId,
}: {
  offreExistante?: Partial<DonneesOffre>;
  offreId?: string;
}) {
  const router = useRouter();
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");

  async function gererEnvoi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    const formData = new FormData(e.currentTarget);
    const data = {
      intitulePoste: formData.get("intitulePoste"),
      entrepriseNom: formData.get("entrepriseNom"),
      afficherNom: formData.get("afficherNom") === "on",
      localisation: formData.get("localisation"),
      typeContrat: formData.get("typeContrat"),
      niveauEtude: formData.get("niveauEtude"),
      experience: formData.get("experience"),
      salaire: formData.get("salaire"),
      description: formData.get("description"),
      missions: formData.get("missions"),
      profilRecherche: formData.get("profilRecherche"),
      competences: formData.get("competences"),
      statut: formData.get("statut"),
      dateExpiration: formData.get("dateExpiration"),
    };

    try {
      const url = offreId ? `/api/admin/offres/${offreId}` : "/api/admin/offres";
      const methode = offreId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: methode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      router.push("/admin/offres");
      router.refresh();
    } catch {
      setErreur("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <form onSubmit={gererEnvoi} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <Champ label="Intitulé du poste" name="intitulePoste" defaultValue={offreExistante?.intitulePoste} required />
        <Champ label="Localisation" name="localisation" defaultValue={offreExistante?.localisation} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Champ label="Nom de l'entreprise (optionnel)" name="entrepriseNom" defaultValue={offreExistante?.entrepriseNom} />
        <label className="flex items-center gap-2 text-sm text-[var(--color-texte)] mt-6">
          <input
            type="checkbox"
            name="afficherNom"
            defaultChecked={offreExistante?.afficherNom ?? true}
          />
          Afficher le nom de l&apos;entreprise (sinon &quot;Entreprise partenaire&quot;)
        </label>
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className="text-sm font-medium text-[var(--color-texte)]">Type de contrat *</label>
          <select
            name="typeContrat"
            defaultValue={offreExistante?.typeContrat || "CDI"}
            required
            className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
          >
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Stage">Stage</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
        <Champ label="Niveau d'étude" name="niveauEtude" defaultValue={offreExistante?.niveauEtude} required />
        <Champ label="Expérience demandée" name="experience" defaultValue={offreExistante?.experience} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Champ label="Salaire / grille salariale (optionnel)" name="salaire" defaultValue={offreExistante?.salaire} />
        <Champ label="Date limite de candidature (optionnel)" name="dateExpiration" type="date" defaultValue={offreExistante?.dateExpiration} />
      </div>

      <Champ label="Description du poste" name="description" defaultValue={offreExistante?.description} textarea required />
      <Champ label="Missions" name="missions" defaultValue={offreExistante?.missions} textarea required />
      <Champ label="Profil recherché" name="profilRecherche" defaultValue={offreExistante?.profilRecherche} textarea required />
      <Champ label="Compétences recherchées" name="competences" defaultValue={offreExistante?.competences} textarea required />

      <div>
        <label className="text-sm font-medium text-[var(--color-texte)]">Statut</label>
        <select
          name="statut"
          defaultValue={offreExistante?.statut || "BROUILLON"}
          className="mt-1.5 w-full sm:w-64 border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
        >
          <option value="BROUILLON">Brouillon</option>
          <option value="PUBLIEE">Publiée</option>
          <option value="DESACTIVEE">Désactivée</option>
        </select>
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={envoi}
          className="bg-[var(--color-bleu-nuit)] text-white px-7 py-3 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
        >
          {envoi ? "Enregistrement..." : offreId ? "Enregistrer les modifications" : "Créer l'offre"}
        </button>
      </div>
    </form>
  );
}

function Champ({
  label,
  name,
  type = "text",
  defaultValue,
  required = false,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
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
          defaultValue={defaultValue}
          required={required}
          rows={4}
          className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] resize-none bg-white"
        />
      ) : (
        <input
          name={name}
          type={type}
          defaultValue={defaultValue}
          required={required}
          className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
        />
      )}
    </div>
  );
}