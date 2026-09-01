"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, GraduationCap, Briefcase, Clock, FileText } from "lucide-react";

type Candidat = {
  reference: string;
  nom: string;
  prenom: string;
  photoUrl: string | null;
  cvUrl: string | null;
  posteRecherche: string;
  domaine: string;
  niveauEtude: string;
  experience: string;
  localisation: string;
  disponibilite: string;
  competences: string;
  typeProfil: string | null;
};

export default function DetailCandidat() {
  const { id } = useParams<{ id: string }>();
  const [candidat, setCandidat] = useState<Candidat | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetch(`/api/cvtheque/${id}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setErreur(data.error || "Une erreur est survenue.");
          return;
        }
        setCandidat(data);
      })
      .finally(() => setChargement(false));
  }, [id]);

  if (chargement) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center text-[var(--color-texte-doux)]">
        Chargement...
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          {erreur}
        </div>
        <Link
          href="/cvtheque"
          className="mt-6 inline-flex items-center gap-2 text-[var(--color-bleu-nuit)] font-medium"
        >
          <ArrowLeft size={16} /> Retour à la CVTHÈQUE
        </Link>
      </div>
    );
  }

  if (!candidat) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/cvtheque"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-texte-doux)] hover:text-[var(--color-bleu-nuit)]"
      >
        <ArrowLeft size={16} /> Retour à la CVTHÈQUE
      </Link>

      <div className="mt-6 flex items-start gap-4">
        {candidat.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={candidat.photoUrl}
            alt={`${candidat.prenom} ${candidat.nom}`}
            className="w-20 h-20 rounded-full object-cover border border-[var(--color-bordure)]"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[var(--color-fond)] border border-[var(--color-bordure)] flex items-center justify-center text-2xl font-medium text-[var(--color-bleu-nuit)]">
            {candidat.prenom[0]}
            {candidat.nom[0]}
          </div>
        )}
        <div>
          <h1 className="font-[var(--font-display)] text-2xl text-[var(--color-bleu-nuit)]">
            {candidat.prenom} {candidat.nom}
          </h1>
          <p className="mt-1 text-[var(--color-texte-doux)]">{candidat.posteRecherche}</p>
          <p className="text-xs text-[var(--color-texte-doux)] mt-1">Réf. {candidat.reference}</p>
        </div>
      </div>

      <div className="mt-8 grid sm:grid-cols-2 gap-4 p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
        <div className="flex items-center gap-2 text-sm">
          <Briefcase size={16} className="text-[var(--color-ambre-fonce)]" /> {candidat.domaine}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap size={16} className="text-[var(--color-ambre-fonce)]" /> {candidat.niveauEtude}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock size={16} className="text-[var(--color-ambre-fonce)]" /> {candidat.experience}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <MapPin size={16} className="text-[var(--color-ambre-fonce)]" /> {candidat.localisation}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)]">Disponibilité</h2>
        <p className="mt-2 text-[var(--color-texte-doux)]">{candidat.disponibilite}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)]">Compétences</h2>
        <p className="mt-2 text-[var(--color-texte-doux)] leading-relaxed whitespace-pre-line">
          {candidat.competences}
        </p>
      </div>

      {candidat.cvUrl && (
        <div className="mt-8">
          <a
            href={candidat.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[var(--color-bleu-nuit)] text-white px-6 py-3 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors"
          >
            <FileText size={18} /> Voir le CV
          </a>
        </div>
      )}
    </section>
  );
}