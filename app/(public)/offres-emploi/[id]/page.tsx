"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  Clock,
  Wallet,
  ArrowLeft,
} from "lucide-react";

type Offre = {
  id: string;
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
  datePublication: string;
  dateExpiration: string | null;
};

export default function DetailOffre() {
  const { id } = useParams<{ id: string }>();
  const [offre, setOffre] = useState<Offre | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(false);

  useEffect(() => {
    fetch(`/api/offres/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setOffre(data))
      .catch(() => setErreur(true))
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-[var(--color-texte-doux)]">
        Chargement de l&apos;offre...
      </div>
    );
  }

  if (erreur || !offre) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-[var(--color-texte-doux)]">
          Cette offre n&apos;existe pas ou n&apos;est plus disponible.
        </p>
        <Link
          href="/offres-emploi"
          className="mt-4 inline-flex items-center gap-2 text-[var(--color-bleu-nuit)] font-medium"
        >
          <ArrowLeft size={16} /> Retour aux offres
        </Link>
      </div>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/offres-emploi"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-texte-doux)] hover:text-[var(--color-bleu-nuit)]"
      >
        <ArrowLeft size={16} /> Retour aux offres
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
            {offre.intitulePoste}
          </h1>
          <p className="mt-2 text-[var(--color-texte-doux)]">
            {offre.afficherNom && offre.entrepriseNom
              ? offre.entrepriseNom
              : "Entreprise partenaire"}
          </p>
        </div>
        <span className="text-sm bg-[var(--color-bleu-nuit)] text-white px-4 py-2 rounded-full shrink-0">
          {offre.typeContrat}
        </span>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4 p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-[var(--color-ambre-fonce)]" /> {offre.localisation}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap size={16} className="text-[var(--color-ambre-fonce)]" /> {offre.niveauEtude}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Briefcase size={16} className="text-[var(--color-ambre-fonce)]" /> {offre.experience}
        </div>
        {offre.salaire && (
          <div className="flex items-center gap-2 text-sm">
            <Wallet size={16} className="text-[var(--color-ambre-fonce)]" /> {offre.salaire}
          </div>
        )}
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-[var(--color-ambre-fonce)]" />
          Publié le {new Date(offre.datePublication).toLocaleDateString("fr-FR")}
        </div>
        {offre.dateExpiration && (
          <div className="flex items-center gap-2 text-sm">
            <Clock size={16} className="text-[var(--color-ambre-fonce)]" />
            Date limite : {new Date(offre.dateExpiration).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>

      <div className="mt-10 space-y-8">
        <div>
          <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)]">
            Description du poste
          </h2>
          <p className="mt-3 text-[var(--color-texte-doux)] leading-relaxed whitespace-pre-line">
            {offre.description}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)]">Missions</h2>
          <p className="mt-3 text-[var(--color-texte-doux)] leading-relaxed whitespace-pre-line">
            {offre.missions}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)]">
            Profil recherché
          </h2>
          <p className="mt-3 text-[var(--color-texte-doux)] leading-relaxed whitespace-pre-line">
            {offre.profilRecherche}
          </p>
        </div>
        <div>
          <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)]">
            Compétences recherchées
          </h2>
          <p className="mt-3 text-[var(--color-texte-doux)] leading-relaxed whitespace-pre-line">
            {offre.competences}
          </p>
        </div>
      </div>

      <div className="mt-12">
        <Link
          href={`/nous-contacter?offre=${encodeURIComponent(offre.intitulePoste)}`}
          className="inline-block bg-[var(--color-ambre-fonce)] text-white px-8 py-3.5 rounded-md font-medium hover:bg-[var(--color-ambre)] transition-colors"
        >
          Postuler
        </Link>
      </div>
    </section>
  );
}