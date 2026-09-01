"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin, EyeOff, Eye } from "lucide-react";

type Candidat = {
  id: string;
  reference: string;
  nom: string;
  prenom: string;
  posteRecherche: string;
  domaine: string;
  localisation: string;
  actif: boolean;
  confidentiel: boolean;
};

export default function AdminCandidats() {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");

  function chargerCandidats() {
    setChargement(true);
    fetch("/api/admin/candidats")
      .then((res) => res.json())
      .then((data) => setCandidats(Array.isArray(data) ? data : []))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerCandidats();
  }, []);

  async function supprimerCandidat(id: string) {
    if (!confirm("Supprimer définitivement ce candidat ?")) return;
    await fetch(`/api/admin/candidats/${id}`, { method: "DELETE" });
    chargerCandidats();
  }

  async function toggleActif(id: string, actif: boolean) {
    await fetch(`/api/admin/candidats/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ actif: !actif }),
    });
    chargerCandidats();
  }

  const candidatsFiltres = candidats.filter(
    (c) =>
      !recherche ||
      c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.prenom.toLowerCase().includes(recherche.toLowerCase()) ||
      c.posteRecherche.toLowerCase().includes(recherche.toLowerCase()) ||
      c.reference.toLowerCase().includes(recherche.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
            Candidats — CVTHÈQUE
          </h1>
          <p className="mt-2 text-[var(--color-texte-doux)]">
            {candidats.length} candidat{candidats.length > 1 ? "s" : ""} enregistré{candidats.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/candidats/nouveau"
          className="flex items-center gap-2 bg-[var(--color-bleu-nuit)] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors"
        >
          <Plus size={18} /> Ajouter un candidat
        </Link>
      </div>

      <input
        placeholder="Rechercher par nom, poste ou référence..."
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        className="mt-6 w-full sm:w-96 border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
      />

      <div className="mt-8">
        {chargement ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>
        ) : candidatsFiltres.length === 0 ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Aucun candidat trouvé.</p>
        ) : (
          <div className="space-y-4">
            {candidatsFiltres.map((c) => (
              <div
                key={c.id}
                className="p-5 bg-white border border-[var(--color-bordure)] rounded-xl flex flex-wrap items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="font-medium text-[var(--color-bleu-nuit)]">
                      {c.prenom} {c.nom}
                    </h2>
                    <span className="text-xs text-[var(--color-texte-doux)]">
                      Réf. {c.reference}
                    </span>
                    {!c.actif && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        Désactivé
                      </span>
                    )}
                    {c.confidentiel && (
                      <span className="flex items-center gap-1 text-xs text-[var(--color-ambre-fonce)]">
                        <EyeOff size={12} /> Confidentiel
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-[var(--color-texte-doux)]">
                    {c.posteRecherche} · {c.domaine}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-[var(--color-texte-doux)]">
                    <MapPin size={14} /> {c.localisation}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => toggleActif(c.id, c.actif)}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-texte-doux)] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {c.actif ? <EyeOff size={16} /> : <Eye size={16} />}
                    {c.actif ? "Désactiver" : "Activer"}
                  </button>
                  <Link
                    href={`/admin/candidats/${c.id}`}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-bleu-nuit)] px-3 py-2 rounded-md hover:bg-[var(--color-fond)] transition-colors"
                  >
                    <Pencil size={16} /> Modifier
                  </Link>
                  <button
                    onClick={() => supprimerCandidat(c.id)}
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