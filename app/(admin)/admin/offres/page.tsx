"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin } from "lucide-react";

type Offre = {
  id: string;
  intitulePoste: string;
  localisation: string;
  typeContrat: string;
  statut: string;
  datePublication: string;
};

const statutsInfo: Record<string, { label: string; couleur: string }> = {
  BROUILLON: { label: "Brouillon", couleur: "bg-gray-100 text-gray-800" },
  PUBLIEE: { label: "Publiée", couleur: "bg-green-100 text-green-800" },
  DESACTIVEE: { label: "Désactivée", couleur: "bg-orange-100 text-orange-800" },
  EXPIREE: { label: "Expirée", couleur: "bg-red-100 text-red-800" },
};

export default function AdminOffres() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [chargement, setChargement] = useState(true);

  function chargerOffres() {
    setChargement(true);
    fetch("/api/admin/offres")
      .then((res) => res.json())
      .then((data) => setOffres(Array.isArray(data) ? data : []))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerOffres();
  }, []);

  async function supprimerOffre(id: string) {
    if (!confirm("Supprimer définitivement cette offre ?")) return;
    await fetch(`/api/admin/offres/${id}`, { method: "DELETE" });
    chargerOffres();
  }

  async function changerStatut(id: string, statut: string) {
    await fetch(`/api/admin/offres/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    chargerOffres();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
            Offres d&apos;emploi
          </h1>
          <p className="mt-2 text-[var(--color-texte-doux)]">
            {offres.length} offre{offres.length > 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          href="/admin/offres/nouvelle"
          className="flex items-center gap-2 bg-[var(--color-bleu-nuit)] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors"
        >
          <Plus size={18} /> Nouvelle offre
        </Link>
      </div>

      <div className="mt-8">
        {chargement ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>
        ) : offres.length === 0 ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Aucune offre créée pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {offres.map((offre) => (
              <div
                key={offre.id}
                className="p-5 bg-white border border-[var(--color-bordure)] rounded-xl flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-medium text-[var(--color-bleu-nuit)]">
                      {offre.intitulePoste}
                    </h2>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutsInfo[offre.statut].couleur}`}>
                      {statutsInfo[offre.statut].label}
                    </span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-texte-doux)]">
                    <MapPin size={14} /> {offre.localisation} · {offre.typeContrat}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {offre.statut === "BROUILLON" && (
                    <button
                      onClick={() => changerStatut(offre.id, "PUBLIEE")}
                      className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Publier
                    </button>
                  )}
                  {offre.statut === "PUBLIEE" && (
                    <button
                      onClick={() => changerStatut(offre.id, "DESACTIVEE")}
                      className="text-sm border border-orange-300 text-orange-700 px-4 py-2 rounded-md hover:bg-orange-50 transition-colors"
                    >
                      Désactiver
                    </button>
                  )}
                  {offre.statut === "DESACTIVEE" && (
                    <button
                      onClick={() => changerStatut(offre.id, "PUBLIEE")}
                      className="text-sm bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                    >
                      Republier
                    </button>
                  )}
                  <Link
                    href={`/admin/offres/${offre.id}`}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-bleu-nuit)] px-3 py-2 rounded-md hover:bg-[var(--color-fond)] transition-colors"
                  >
                    <Pencil size={16} /> Modifier
                  </Link>
                  <button
                    onClick={() => supprimerOffre(offre.id)}
                    className="flex items-center gap-1.5 text-sm text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={16} /> Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}