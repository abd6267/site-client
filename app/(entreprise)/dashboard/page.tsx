"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Database,
  RefreshCw,
  User,
  LogOut,
  AlertCircle,
  Clock,
} from "lucide-react";

type DashboardData = {
  entreprise: { nomEntreprise: string; email: string; statut: string };
  abonnement: {
    type: string;
    duree: string;
    dateDebut: string;
    dateExpiration: string;
  } | null;
  consultationsAujourdhui: number;
  quotaJournalier: number;
};

const libellesStatut: Record<string, { label: string; couleur: string }> = {
  EN_ATTENTE: { label: "En attente de validation", couleur: "bg-amber-100 text-amber-800" },
  VALIDE: { label: "Compte validé", couleur: "bg-green-100 text-green-800" },
  REJETE: { label: "Compte rejeté", couleur: "bg-red-100 text-red-800" },
  SUSPENDU: { label: "Compte suspendu", couleur: "bg-red-100 text-red-800" },
  DESACTIVE: { label: "Compte désactivé", couleur: "bg-gray-100 text-gray-800" },
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch("/api/entreprises/moi")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok || json.error) {
          setData(null);
          return;
        }
        setData(json);
      })
      .finally(() => setChargement(false));
  }, []);

  if (chargement) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center text-[var(--color-texte-doux)]">
        Chargement de votre espace...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <p className="text-[var(--color-texte-doux)]">
          Impossible de charger vos informations. Veuillez vous reconnecter.
        </p>
        <a
          href="/connexion"
          className="mt-4 inline-block text-[var(--color-bleu-nuit)] font-medium underline"
        >
          Retour à la connexion
        </a>
      </div>
    );
  }

  const statut = libellesStatut[data.entreprise.statut];
  const restants = Math.max(data.quotaJournalier - data.consultationsAujourdhui, 0);

  return (
    <section className="max-w-5xl mx-auto px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
            {data.entreprise.nomEntreprise}
          </h1>
          <span className={`inline-block mt-2 text-xs px-3 py-1 rounded-full font-medium ${statut.couleur}`}>
            {statut.label}
          </span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-sm text-[var(--color-texte-doux)] hover:text-[var(--color-bleu-nuit)]"
        >
          <LogOut size={16} /> Déconnexion
        </button>
      </div>

      {data.entreprise.statut === "EN_ATTENTE" && (
        <div className="mt-8 flex items-start gap-3 p-5 bg-amber-50 border border-amber-200 rounded-xl">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Votre compte est en cours de vérification par notre équipe.
            Vous pourrez souscrire à un abonnement et accéder à la
            CVTHÈQUE une fois votre compte validé.
          </p>
        </div>
      )}

      {data.entreprise.statut === "VALIDE" && (
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
            <div className="flex items-center gap-2 text-[var(--color-bleu-nuit)]">
              <Database size={18} />
              <h2 className="font-medium">Abonnement CVTHÈQUE</h2>
            </div>

            {data.abonnement ? (
              <>
                <div className="mt-5 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="font-[var(--font-display)] text-2xl text-[var(--color-bleu-nuit)]">
                      {data.abonnement.type}
                    </p>
                    <p className="text-xs text-[var(--color-texte-doux)] mt-1">Formule</p>
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-2xl text-[var(--color-bleu-nuit)]">
                      {data.consultationsAujourdhui}/{data.quotaJournalier}
                    </p>
                    <p className="text-xs text-[var(--color-texte-doux)] mt-1">Consultés aujourd&apos;hui</p>
                  </div>
                  <div>
                    <p className="font-[var(--font-display)] text-2xl text-[var(--color-bleu-nuit)]">
                      {restants}
                    </p>
                    <p className="text-xs text-[var(--color-texte-doux)] mt-1">Restants aujourd&apos;hui</p>
                  </div>
                </div>
                <p className="mt-5 flex items-center gap-2 text-xs text-[var(--color-texte-doux)]">
                  <Clock size={14} />
                  Expire le {new Date(data.abonnement.dateExpiration).toLocaleDateString("fr-FR")}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/cvtheque"
                    className="inline-flex items-center gap-2 bg-[var(--color-bleu-nuit)] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors"
                  >
                    <LayoutDashboard size={16} /> Accéder à la CVTHÈQUE
                  </Link>
                  <Link
                    href="/abonnement"
                    className="inline-flex items-center gap-2 border border-[var(--color-bordure)] px-5 py-2.5 rounded-md text-sm font-medium hover:border-[var(--color-bleu-nuit)] transition-colors"
                  >
                    <RefreshCw size={16} /> Renouveler mon abonnement
                  </Link>
                </div>
              </>
            ) : (
              <div className="mt-5">
                <p className="text-sm text-[var(--color-texte-doux)]">
                  Vous n&apos;avez pas encore d&apos;abonnement actif.
                  Souscrivez pour accéder à la BTEC CVTHÈQUE.
                </p>
                <Link
                  href="/abonnement"
                  className="mt-4 inline-block bg-[var(--color-ambre-fonce)] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[var(--color-ambre)] transition-colors"
                >
                  Souscrire à un abonnement
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/profil"
            className="p-6 bg-white border border-[var(--color-bordure)] rounded-xl hover:border-[var(--color-ambre)] transition-colors h-fit"
          >
            <User size={18} className="text-[var(--color-ambre-fonce)]" />
            <h2 className="mt-3 font-medium text-[var(--color-bleu-nuit)]">
              Profil entreprise
            </h2>
            <p className="mt-2 text-sm text-[var(--color-texte-doux)]">
              Gérer les informations de votre entreprise.
            </p>
          </Link>
        </div>
      )}
    </section>
  );
}