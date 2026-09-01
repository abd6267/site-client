"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, GraduationCap, Eye, Lock } from "lucide-react";

type Candidat = {
  id: string;
  reference: string;
  nom: string | null;
  prenom: string | null;
  photoUrl: string | null;
  posteRecherche: string;
  domaine: string;
  niveauEtude: string;
  experience: string;
  localisation: string;
  disponibilite: string;
  dejaConsulte: boolean;
};

export default function CVTheque() {
  const [candidats, setCandidats] = useState<Candidat[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState("");
  const [recherche, setRecherche] = useState("");
  const [domaine, setDomaine] = useState("");
  const [localisation, setLocalisation] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (recherche) params.set("recherche", recherche);
      if (domaine) params.set("domaine", domaine);
      if (localisation) params.set("localisation", localisation);

      setChargement(true);
      fetch(`/api/cvtheque?${params.toString()}`)
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) {
            setErreur(data.error || "Une erreur est survenue.");
            setCandidats([]);
            return;
          }
          setCandidats(Array.isArray(data) ? data : []);
        })
        .finally(() => setChargement(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [recherche, domaine, localisation]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-bleu-nuit)]">
        BTEC CVTHÈQUE
      </h1>
      <p className="mt-3 text-[var(--color-texte-doux)] max-w-lg">
        Recherchez des candidats selon vos critères de recrutement.
      </p>

      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-texte-doux)]" />
          <input
            placeholder="Poste, compétences, référence..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-[var(--color-bordure)] rounded-md outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
          />
        </div>
        <input
          placeholder="Domaine professionnel"
          value={domaine}
          onChange={(e) => setDomaine(e.target.value)}
          className="px-4 py-3 border border-[var(--color-bordure)] rounded-md outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
        />
        <input
          placeholder="Localisation"
          value={localisation}
          onChange={(e) => setLocalisation(e.target.value)}
          className="px-4 py-3 border border-[var(--color-bordure)] rounded-md outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
        />
      </div>

      <div className="mt-10">
        {erreur && (
          <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
            {erreur}
          </div>
        )}

        {chargement ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>
        ) : !erreur && candidats.length === 0 ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Aucun candidat ne correspond à votre recherche.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {candidats.map((c) => (
              <Link
                key={c.id}
                href={`/cvtheque/${c.id}`}
                className="p-5 bg-white border border-[var(--color-bordure)] rounded-xl hover:border-[var(--color-ambre)] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[var(--color-texte-doux)]">{c.reference}</span>
                  {c.dejaConsulte ? (
                    <span className="flex items-center gap-1 text-xs text-green-700">
                      <Eye size={12} /> Consulté
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs text-[var(--color-ambre-fonce)]">
                      <Lock size={12} /> À découvrir
                    </span>
                  )}
                </div>
                <h2 className="mt-2 font-medium text-[var(--color-bleu-nuit)]">
                  {c.dejaConsulte && c.nom ? `${c.prenom} ${c.nom}` : "Profil confidentiel"}
                </h2>
                <p className="mt-1 text-sm text-[var(--color-texte-doux)]">{c.posteRecherche}</p>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--color-texte-doux)]">
                  <span className="flex items-center gap-1">
                    <GraduationCap size={13} /> {c.niveauEtude}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> {c.localisation}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}