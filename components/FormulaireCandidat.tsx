"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type DonneesCandidat = {
  nom: string;
  prenom: string;
  posteRecherche: string;
  domaine: string;
  niveauEtude: string;
  experience: string;
  localisation: string;
  disponibilite: string;
  competences: string;
  typeProfil: string;
  photoUrl: string;
  cvUrl: string;
  confidentiel: boolean;
  actif: boolean;
};

export default function FormulaireCandidat({
  candidatExistant,
  candidatId,
}: {
  candidatExistant?: Partial<DonneesCandidat>;
  candidatId?: string;
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
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      posteRecherche: formData.get("posteRecherche"),
      domaine: formData.get("domaine"),
      niveauEtude: formData.get("niveauEtude"),
      experience: formData.get("experience"),
      localisation: formData.get("localisation"),
      disponibilite: formData.get("disponibilite"),
      competences: formData.get("competences"),
      typeProfil: formData.get("typeProfil"),
      photoUrl: formData.get("photoUrl"),
      cvUrl: formData.get("cvUrl"),
      confidentiel: formData.get("confidentiel") === "on",
      actif: formData.get("actif") === "on",
    };

    try {
      const url = candidatId ? `/api/admin/candidats/${candidatId}` : "/api/admin/candidats";
      const methode = candidatId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method: methode,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error();

      router.push("/admin/candidats");
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
        <Champ label="Nom" name="nom" defaultValue={candidatExistant?.nom} required />
        <Champ label="Prénom" name="prenom" defaultValue={candidatExistant?.prenom} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Champ label="Poste recherché" name="posteRecherche" defaultValue={candidatExistant?.posteRecherche} required />
        <Champ label="Domaine professionnel" name="domaine" defaultValue={candidatExistant?.domaine} required />
      </div>

      <div className="grid sm:grid-cols-3 gap-5">
        <Champ label="Niveau d'étude" name="niveauEtude" defaultValue={candidatExistant?.niveauEtude} required />
        <Champ label="Expérience" name="experience" defaultValue={candidatExistant?.experience} required />
        <Champ label="Localisation" name="localisation" defaultValue={candidatExistant?.localisation} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Champ label="Disponibilité" name="disponibilite" defaultValue={candidatExistant?.disponibilite} required />
        <Champ label="Type de profil (optionnel)" name="typeProfil" defaultValue={candidatExistant?.typeProfil} />
      </div>

      <Champ label="Compétences" name="competences" defaultValue={candidatExistant?.competences} textarea required />

      <div className="grid sm:grid-cols-2 gap-5">
        <Champ label="URL de la photo (optionnel)" name="photoUrl" defaultValue={candidatExistant?.photoUrl} />
        <Champ label="URL du CV (optionnel)" name="cvUrl" defaultValue={candidatExistant?.cvUrl} />
      </div>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm text-[var(--color-texte)]">
          <input
            type="checkbox"
            name="confidentiel"
            defaultChecked={candidatExistant?.confidentiel ?? true}
          />
          Masquer le nom/prénom avant consultation (confidentialité)
        </label>
        <label className="flex items-center gap-2 text-sm text-[var(--color-texte)]">
          <input
            type="checkbox"
            name="actif"
            defaultChecked={candidatExistant?.actif ?? true}
          />
          Profil actif (visible dans la CVTHÈQUE)
        </label>
      </div>

      {erreur && <p className="text-sm text-red-600">{erreur}</p>}

      <button
        type="submit"
        disabled={envoi}
        className="bg-[var(--color-bleu-nuit)] text-white px-7 py-3 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
      >
        {envoi ? "Enregistrement..." : candidatId ? "Enregistrer les modifications" : "Ajouter le candidat"}
      </button>
    </form>
  );
}

function Champ({
  label,
  name,
  defaultValue,
  required = false,
  textarea = false,
}: {
  label: string;
  name: string;
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
          rows={3}
          className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] resize-none bg-white"
        />
      ) : (
        <input
          name={name}
          defaultValue={defaultValue}
          required={required}
          className="mt-1.5 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
        />
      )}
    </div>
  );
}