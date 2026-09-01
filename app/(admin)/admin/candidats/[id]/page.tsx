"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormulaireCandidat from "@/components/FormulaireCandidat";

type Candidat = {
  nom: string;
  prenom: string;
  posteRecherche: string;
  domaine: string;
  niveauEtude: string;
  experience: string;
  localisation: string;
  disponibilite: string;
  competences: string;
  typeProfil: string | null;
  photoUrl: string | null;
  cvUrl: string | null;
  confidentiel: boolean;
  actif: boolean;
};

export default function ModifierCandidat() {
  const { id } = useParams<{ id: string }>();
  const [candidat, setCandidat] = useState<Candidat | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/candidats/${id}`)
      .then((res) => res.json())
      .then(setCandidat)
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) {
    return <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>;
  }

  if (!candidat) {
    return <p className="text-sm text-[var(--color-texte-doux)]">Candidat introuvable.</p>;
  }

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Modifier le candidat
      </h1>
      <div className="mt-8 max-w-3xl">
        <FormulaireCandidat
          candidatId={id}
          candidatExistant={{
            nom: candidat.nom,
            prenom: candidat.prenom,
            posteRecherche: candidat.posteRecherche,
            domaine: candidat.domaine,
            niveauEtude: candidat.niveauEtude,
            experience: candidat.experience,
            localisation: candidat.localisation,
            disponibilite: candidat.disponibilite,
            competences: candidat.competences,
            typeProfil: candidat.typeProfil || "",
            photoUrl: candidat.photoUrl || "",
            cvUrl: candidat.cvUrl || "",
            confidentiel: candidat.confidentiel,
            actif: candidat.actif,
          }}
        />
      </div>
    </div>
  );
}