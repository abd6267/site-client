"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, PauseCircle, Ban } from "lucide-react";

type Entreprise = {
  id: string;
  nomEntreprise: string;
  nomPromoteur: string;
  email: string;
  telephone: string;
  rccm: string;
  statut: string;
  createdAt: string;
  abonnements: { type: string }[];
};

const statutsInfo: Record<string, { label: string; couleur: string }> = {
  EN_ATTENTE: { label: "En attente", couleur: "bg-amber-100 text-amber-800" },
  VALIDE: { label: "Validé", couleur: "bg-green-100 text-green-800" },
  REJETE: { label: "Rejeté", couleur: "bg-red-100 text-red-800" },
  SUSPENDU: { label: "Suspendu", couleur: "bg-orange-100 text-orange-800" },
  DESACTIVE: { label: "Désactivé", couleur: "bg-gray-100 text-gray-800" },
};

export default function AdminEntreprises() {
  const [entreprises, setEntreprises] = useState<Entreprise[]>([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState("TOUS");

  function chargerEntreprises() {
    setChargement(true);
    fetch("/api/admin/entreprises")
      .then((res) => res.json())
      .then((data) => setEntreprises(Array.isArray(data) ? data : []))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerEntreprises();
  }, []);

  async function changerStatut(id: string, statut: string) {
    await fetch(`/api/admin/entreprises/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    chargerEntreprises();
  }

  const entreprisesFiltrees =
    filtre === "TOUS" ? entreprises : entreprises.filter((e) => e.statut === filtre);

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Gestion des entreprises
      </h1>
      <p className="mt-2 text-[var(--color-texte-doux)]">
        {entreprises.length} entreprise{entreprises.length > 1 ? "s" : ""} inscrite{entreprises.length > 1 ? "s" : ""}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["TOUS", "EN_ATTENTE", "VALIDE", "REJETE", "SUSPENDU", "DESACTIVE"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              filtre === s
                ? "bg-[var(--color-bleu-nuit)] text-white border-[var(--color-bleu-nuit)]"
                : "border-[var(--color-bordure)] text-[var(--color-texte-doux)]"
            }`}
          >
            {s === "TOUS" ? "Tous" : statutsInfo[s].label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {chargement ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>
        ) : entreprisesFiltrees.length === 0 ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Aucune entreprise dans cette catégorie.</p>
        ) : (
          <div className="space-y-4">
            {entreprisesFiltrees.map((e) => (
              <div
                key={e.id}
                className="p-5 bg-white border border-[var(--color-bordure)] rounded-xl"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-medium text-[var(--color-bleu-nuit)]">
                        {e.nomEntreprise}
                      </h2>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutsInfo[e.statut].couleur}`}>
                        {statutsInfo[e.statut].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-texte-doux)]">
                      Promoteur : {e.nomPromoteur} · RCCM : {e.rccm}
                    </p>
                    <p className="text-sm text-[var(--color-texte-doux)]">
                      {e.email} · {e.telephone}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-texte-doux)]">
                      Inscrit le {new Date(e.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {e.statut === "EN_ATTENTE" && (
                      <>
                        <button
                          onClick={() => changerStatut(e.id, "VALIDE")}
                          className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle2 size={16} /> Valider
                        </button>
                        <button
                          onClick={() => changerStatut(e.id, "REJETE")}
                          className="flex items-center gap-1.5 text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                        >
                          <XCircle size={16} /> Rejeter
                        </button>
                      </>
                    )}
                    {e.statut === "VALIDE" && (
                      <button
                        onClick={() => changerStatut(e.id, "SUSPENDU")}
                        className="flex items-center gap-1.5 text-sm border border-orange-300 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-50 transition-colors"
                      >
                        <PauseCircle size={16} /> Suspendre
                      </button>
                    )}
                    {(e.statut === "SUSPENDU" || e.statut === "REJETE") && (
                      <button
                        onClick={() => changerStatut(e.id, "VALIDE")}
                        className="flex items-center gap-1.5 text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle2 size={16} /> Réactiver
                      </button>
                    )}
                    {e.statut !== "DESACTIVE" && (
                      <button
                        onClick={() => changerStatut(e.id, "DESACTIVE")}
                        className="flex items-center gap-1.5 text-sm text-[var(--color-texte-doux)] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <Ban size={16} /> Désactiver
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}