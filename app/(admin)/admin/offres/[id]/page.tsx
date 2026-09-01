"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FormulaireOffre from "@/components/FormulaireOffre";

type Offre = {
  intitulePoste: string;
  entrepriseNom: string | null;
  afficherNom: boolean;
  localisation: string;
  typeContrat: string;
  niveauEtude: string;
  experience: string;
  salaire: string | null;
  description: string;
  missions: string;
  profilRecherche: string;
  competences: string;
  statut: string;
  dateExpiration: string | null;
};

export default function ModifierOffre() {
  const { id } = useParams<{ id: string }>();
  const [offre, setOffre] = useState<Offre | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/offres/${id}`)
      .then((res) => res.json())
      .then(setOffre)
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) {
    return <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>;
  }

  if (!offre) {
    return <p className="text-sm text-[var(--color-texte-doux)]">Offre introuvable.</p>;
  }

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Modifier l&apos;offre
      </h1>
      <div className="mt-8 max-w-3xl">
        <FormulaireOffre
          offreId={id}
          offreExistante={{
            intitulePoste: offre.intitulePoste,
            entrepriseNom: offre.entrepriseNom || "",
            afficherNom: offre.afficherNom,
            localisation: offre.localisation,
            typeContrat: offre.typeContrat,
            niveauEtude: offre.niveauEtude,
            experience: offre.experience,
            salaire: offre.salaire || "",
            description: offre.description,
            missions: offre.missions,
            profilRecherche: offre.profilRecherche,
            competences: offre.competences,
            statut: offre.statut,
            dateExpiration: offre.dateExpiration
              ? new Date(offre.dateExpiration).toISOString().split("T")[0]
              : "",
          }}
        />
      </div>
    </div>
  );
}