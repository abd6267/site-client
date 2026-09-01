"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Users, Calendar } from "lucide-react";

type Demande = {
  id: string;
  reference: string;
  nomEntreprise: string;
  posteRecherche: string;
  nombrePersonnes: number;
  statut: string;
  createdAt: string;
};

const statutsInfo: Record<string, { label: string; couleur: string }> = {
  NOUVELLE: { label: "Nouvelle demande", couleur: "bg-blue-100 text-blue-800" },
  EN_COURS: { label: "En cours de traitement", couleur: "bg-amber-100 text-amber-800" },
  VALIDEE: { label: "Validée", couleur: "bg-green-100 text-green-800" },
  RECRUTEMENT_EN_COURS: { label: "Recrutement en cours", couleur: "bg-purple-100 text-purple-800" },
  CLOTUREE: { label: "Clôturée", couleur: "bg-gray-100 text-gray-800" },
};

export default function AdminDemandes() {
  const [demandes, setDemandes] = useState<Demande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState("TOUS");
  const [recherche, setRecherche] = useState("");

  useEffect(() => {
    fetch("/api/admin/demandes")
      .then((res) => res.json())
      .then((data) => setDemandes(Array.isArray(data) ? data : []))
      .finally(() => setChargement(false));
  }, []);

  const demandesFiltrees = demandes
    .filter((d) => filtre === "TOUS" || d.statut === filtre)
    .filter(
      (d) =>
        !recherche ||
        d.nomEntreprise.toLowerCase().includes(recherche.toLowerCase()) ||
        d.reference.toLowerCase().includes(recherche.toLowerCase())
    );

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Demandes de recrutement
      </h1>
      <p className="mt-2 text-[var(--color-texte-doux)]">
        {demandes.length} demande{demandes.length > 1 ? "s" : ""} reçue{demandes.length > 1 ? "s" : ""}
      </p>

      <input
        placeholder="Rechercher par entreprise ou référence..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="mt-6 w-full sm:w-96 border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {["TOUS", "NOUVELLE", "EN_COURS", "VALIDEE", "RECRUTEMENT_EN_COURS", "CLOTUREE"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              filtre === s
                ? "bg-[var(--color-bleu-nuit)] text-white border-[var(--color-bleu-nuit)]"
                : "border-[var(--color-bordure)] text-[var(--color-texte-doux)]"
            }`}
          >
            {s === "TOUS" ? "Toutes" : statutsInfo[s].label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {chargement ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>
        ) : demandesFiltrees.length === 0 ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Aucune demande dans cette catégorie.</p>
        ) : (
          <div className="space-y-4">
            {demandesFiltrees.map((d) => (
              <Link
                key={d.id}
                href={`/admin/demandes/${d.id}`}
                className="block p-5 bg-white border border-[var(--color-bordure)] rounded-xl hover:border-[var(--color-ambre)] transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-medium text-[var(--color-bleu-nuit)]">
                        {d.nomEntreprise}
                      </h2>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutsInfo[d.statut].couleur}`}>
                        {statutsInfo[d.statut].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-texte-doux)]">
                      Réf. {d.reference}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--color-texte-doux)]">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={15} /> {d.posteRecherche}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users size={15} /> {d.nombrePersonnes} personne(s)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {new Date(d.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}