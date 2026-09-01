import Link from "next/link";
import { Users, GraduationCap, Briefcase, Megaphone, ClipboardCheck, PartyPopper, ArrowRight } from "lucide-react";

const domaines = [
  { icon: Users, titre: "Recrutement", desc: "Identification et sélection des meilleurs profils pour votre entreprise." },
  { icon: Briefcase, titre: "Gestion RH", desc: "Accompagnement complet dans la gestion de vos ressources humaines." },
  { icon: GraduationCap, titre: "Formation professionnelle", desc: "Renforcement des compétences de vos équipes." },
  { icon: ClipboardCheck, titre: "Gestion déléguée du personnel", desc: "Nous gérons votre personnel pour vous, en toute conformité." },
  { icon: Megaphone, titre: "Communication & publicité", desc: "Valorisation de votre image employeur." },
  { icon: PartyPopper, titre: "Événementiel", desc: "Organisation de vos événements professionnels et RH." },
];

export default function Accueil() {
  return (
    <>
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-[var(--font-display)] text-5xl md:text-6xl leading-[1.1] text-[var(--color-bleu-nuit)]">
            Recrutez le bon talent, rapidement.
          </h1>
          <p className="mt-6 text-lg text-[var(--color-texte-doux)] max-w-md">
            BTEC BENIN accompagne les entreprises dans leur recrutement et
            leur gestion des ressources humaines depuis 2015.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/fiche-demande"
              className="inline-flex items-center gap-2 bg-[var(--color-bleu-nuit)] text-white px-6 py-3.5 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors"
            >
              Faire une demande de recrutement <ArrowRight size={18} />
            </Link>
            <Link
              href="/offres-emploi"
              className="inline-flex items-center gap-2 border border-[var(--color-bleu-nuit)] text-[var(--color-bleu-nuit)] px-6 py-3.5 rounded-md font-medium hover:bg-white transition-colors"
            >
              Voir les offres d&apos;emploi
            </Link>
          </div>
        </div>

        <div className="bg-[var(--color-bleu-nuit)] rounded-2xl p-10 text-white">
          <p className="text-sm text-[var(--color-ambre)] font-medium mb-6">
            En chiffres
          </p>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-[var(--font-display)] text-4xl">2015</p>
              <p className="text-sm text-white/70 mt-1">Année de création</p>
            </div>
            <div>
              <p className="font-[var(--font-display)] text-4xl">7</p>
              <p className="text-sm text-white/70 mt-1">Domaines d&apos;expertise</p>
            </div>
            <div>
              <p className="font-[var(--font-display)] text-4xl">100%</p>
              <p className="text-sm text-white/70 mt-1">Accompagnement local</p>
            </div>
            <div>
              <p className="font-[var(--font-display)] text-4xl">RH</p>
              <p className="text-sm text-white/70 mt-1">Notre cœur de métier</p>
            </div>
          </div>
        </div>
      </section>

      {/* DOMAINES D'INTERVENTION */}
      <section className="bg-white border-y border-[var(--color-bordure)]">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)] max-w-lg">
            Nos domaines d&apos;intervention
          </h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {domaines.map((d) => (
              <div
                key={d.titre}
                className="p-6 rounded-xl border border-[var(--color-bordure)] hover:border-[var(--color-ambre)] transition-colors"
              >
                <d.icon size={28} className="text-[var(--color-ambre-fonce)]" />
                <h3 className="mt-4 text-lg font-medium text-[var(--color-bleu-nuit)]">
                  {d.titre}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-texte-doux)] leading-relaxed">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA ENTREPRISE */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)] max-w-xl mx-auto">
          Besoin de recruter un collaborateur ?
        </h2>
        <p className="mt-4 text-[var(--color-texte-doux)] max-w-md mx-auto">
          Créez votre compte entreprise et accédez à la BTEC CVTHÈQUE pour
          consulter des profils qualifiés.
        </p>
        <Link
          href="/inscription"
          className="mt-8 inline-flex items-center gap-2 bg-[var(--color-ambre-fonce)] text-white px-7 py-3.5 rounded-md font-medium hover:bg-[var(--color-ambre)] transition-colors"
        >
          Créer mon compte entreprise <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}