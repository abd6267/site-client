"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, Calendar, Inbox } from "lucide-react";

type Offre = {
  id: string;
  intitulePoste: string;
  entrepriseNom: string | null;
  afficherNom: boolean;
  localisation: string;
  typeContrat: string;
  niveauEtude: string;
  datePublication: string;
};

export default function OffresEmploi() {
  const [offres, setOffres] = useState<Offre[]>([]);
  const [chargement, setChargement] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [typeContrat, setTypeContrat] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (recherche) params.set("recherche", recherche);
      if (localisation) params.set("localisation", localisation);
      if (typeContrat) params.set("typeContrat", typeContrat);

      setChargement(true);
      fetch(`/api/offres?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => setOffres(Array.isArray(data) ? data : []))
        .finally(() => setChargement(false));
    }, 300);

    return () => clearTimeout(timeout);
  }, [recherche, localisation, typeContrat]);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-bleu-nuit)]">
        Nos offres d&apos;emploi
      </h1>
      <p className="mt-3 text-[var(--color-texte-doux)] max-w-lg">
        Consultez les opportunités disponibles et postulez directement, sans
        création de compte.
      </p>

      {/* FILTRES */}
      <div className="mt-10 grid sm:grid-cols-3 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-texte-doux)]" />
          <input
            placeholder="Rechercher un poste..."
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-[var(--color-bordure)] rounded-md outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
          />
        </div>
        <div className="relative">
          <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-texte-doux)]" />
          <input
            placeholder="Localisation"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-[var(--color-bordure)] rounded-md outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
          />
        </div>
        <select
          value={typeContrat}
          onChange={(e) => setTypeContrat(e.target.value)}
          className="px-4 py-3 border border-[var(--color-bordure)] rounded-md outline-none focus:border-[var(--color-bleu-nuit)] bg-white text-[var(--color-texte)]"
        >
          <option value="">Tous types de contrat</option>
          <option value="CDI">CDI</option>
          <option value="CDD">CDD</option>
          <option value="Stage">Stage</option>
          <option value="Freelance">Freelance</option>
        </select>
      </div>

      {/* RESULTATS */}
      <div className="mt-10">
        {chargement ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Chargement des offres...</p>
        ) : offres.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--color-bordure)] rounded-xl">
            <Inbox size={32} className="mx-auto text-[var(--color-texte-doux)]" />
            <p className="mt-4 text-[var(--color-texte-doux)]">
              Aucune offre ne correspond à votre recherche pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {offres.map((offre) => (
              <Link
                key={offre.id}
                href={`/offres-emploi/${offre.id}`}
                className="block p-6 bg-white border border-[var(--color-bordure)] rounded-xl hover:border-[var(--color-ambre)] transition-colors"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-medium text-[var(--color-bleu-nuit)]">
                      {offre.intitulePoste}
                    </h2>
                    <p className="text-sm text-[var(--color-texte-doux)] mt-1">
                      {offre.afficherNom && offre.entrepriseNom
                        ? offre.entrepriseNom
                        : "Entreprise partenaire"}
                    </p>
                  </div>
                  <span className="text-xs bg-[var(--color-fond)] border border-[var(--color-bordure)] px-3 py-1.5 rounded-full text-[var(--color-texte-doux)]">
                    {offre.typeContrat}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-5 text-sm text-[var(--color-texte-doux)]">
                  <span className="flex items-center gap-1.5">
                    <MapPin size={15} /> {offre.localisation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Briefcase size={15} /> {offre.niveauEtude}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={15} />
                    {new Date(offre.datePublication).toLocaleDateString("fr-FR")}
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