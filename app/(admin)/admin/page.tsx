"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  Users,
  Briefcase,
  FileText,
  MessageSquare,
  AlertTriangle,
  Wallet,
} from "lucide-react";

type Stats = {
  totalEntreprises: number;
  entreprisesValidees: number;
  entreprisesAbonnees: number;
  totalCandidats: number;
  offresActives: number;
  totalDemandes: number;
  messagesNonLus: number;
  abonnementsExpirantBientot: number;
  chiffreAffairesMois: number;
  demandesParStatut: { statut: string; _count: number }[];
};

const libellesStatutDemande: Record<string, string> = {
  NOUVELLE: "Nouvelles",
  EN_COURS: "En cours",
  VALIDEE: "Validées",
  RECRUTEMENT_EN_COURS: "Recrutement en cours",
  CLOTUREE: "Clôturées",
};

export default function AdminAccueil() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch("/api/admin/statistiques")
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return <p className="text-sm text-[var(--color-texte-doux)]">Chargement des statistiques...</p>;
  }

  if (!stats) {
    return <p className="text-sm text-[var(--color-texte-doux)]">Impossible de charger les statistiques.</p>;
  }

  const cartes = [
    {
      icon: Building2,
      label: "Entreprises inscrites",
      valeur: stats.totalEntreprises,
      sousTexte: `${stats.entreprisesValidees} validée(s)`,
      lien: "/admin/entreprises",
    },
    {
      icon: Wallet,
      label: "Entreprises abonnées",
      valeur: stats.entreprisesAbonnees,
      sousTexte: "Abonnement actif",
      lien: "/admin/entreprises",
    },
    {
      icon: Users,
      label: "Candidats CVTHÈQUE",
      valeur: stats.totalCandidats,
      sousTexte: "Profils actifs",
      lien: "/admin/candidats",
    },
    {
      icon: Briefcase,
      label: "Offres publiées",
      valeur: stats.offresActives,
      sousTexte: "Actuellement en ligne",
      lien: "/admin/offres",
    },
    {
      icon: FileText,
      label: "Demandes de recrutement",
      valeur: stats.totalDemandes,
      sousTexte: "Total reçu",
      lien: "/admin/demandes",
    },
    {
      icon: MessageSquare,
      label: "Messages non lus",
      valeur: stats.messagesNonLus,
      sousTexte: "À traiter",
      lien: "/admin/messages",
    },
  ];

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Vue d&apos;ensemble
      </h1>
      <p className="mt-2 text-[var(--color-texte-doux)]">
        Aperçu de l&apos;activité BTEC BENIN.
      </p>

      {stats.abonnementsExpirantBientot > 0 && (
        <div className="mt-6 flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertTriangle size={20} className="text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            {stats.abonnementsExpirantBientot} abonnement(s) expire(nt) dans les 7 prochains jours.
          </p>
        </div>
      )}

      <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cartes.map((c) => (
          <Link
            key={c.label}
            href={c.lien}
            className="p-5 bg-white border border-[var(--color-bordure)] rounded-xl hover:border-[var(--color-ambre)] transition-colors"
          >
            <c.icon size={20} className="text-[var(--color-ambre-fonce)]" />
            <p className="mt-3 font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
              {c.valeur}
            </p>
            <p className="mt-1 text-sm font-medium text-[var(--color-texte)]">{c.label}</p>
            <p className="text-xs text-[var(--color-texte-doux)] mt-0.5">{c.sousTexte}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
          <h2 className="font-medium text-[var(--color-bleu-nuit)]">
            Chiffre d&apos;affaires du mois
          </h2>
          <p className="mt-3 font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
            {stats.chiffreAffairesMois.toLocaleString("fr-FR")} FCFA
          </p>
          <p className="mt-1 text-xs text-[var(--color-texte-doux)]">
            Paiements d&apos;abonnements confirmés ce mois-ci
          </p>
        </div>

        <div className="p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
          <h2 className="font-medium text-[var(--color-bleu-nuit)]">
            Demandes de recrutement par statut
          </h2>
          <div className="mt-4 space-y-2">
            {stats.demandesParStatut.length === 0 ? (
              <p className="text-sm text-[var(--color-texte-doux)]">Aucune demande pour le moment.</p>
            ) : (
              stats.demandesParStatut.map((d) => (
                <div key={d.statut} className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-texte-doux)]">
                    {libellesStatutDemande[d.statut] || d.statut}
                  </span>
                  <span className="font-medium text-[var(--color-bleu-nuit)]">{d._count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}