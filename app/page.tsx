import Link from "next/link";
import { Users, GraduationCap, Briefcase, Megaphone, ClipboardCheck, PartyPopper, ArrowUpRight } from "lucide-react";

const domaines = [
  { icon: Users, titre: "Recrutement", desc: "Identification et sélection des meilleurs profils." },
  { icon: Briefcase, titre: "Gestion RH", desc: "Accompagnement complet de vos ressources humaines." },
  { icon: GraduationCap, titre: "Formation", desc: "Renforcement des compétences de vos équipes." },
  { icon: ClipboardCheck, titre: "Gestion déléguée", desc: "Nous gérons votre personnel pour vous." },
  { icon: Megaphone, titre: "Communication", desc: "Valorisation de votre image employeur." },
  { icon: PartyPopper, titre: "Événementiel", desc: "Organisation de vos événements RH." },
];

export default function Accueil() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-0 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-[var(--font-display)] text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-tight text-[var(--color-nuit)]">
              Recrutez
              <br />
              le bon talent
              <br />
              <span className="text-[var(--color-corail)]">rapidement.</span>
            </h1>
            <p className="mt-7 text-lg text-[var(--color-texte-doux)] max-w-md">
              BTEC BENIN accompagne les entreprises dans leur recrutement et
              leur gestion des ressources humaines depuis 2015.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link
                href="/fiche-demande"
                className="inline-flex items-center gap-2 bg-[var(--color-nuit)] text-white px-7 py-4 rounded-full font-semibold hover:bg-[var(--color-nuit-clair)] transition-colors"
              >
                Faire une demande de recrutement
              </Link>
              <Link
                href="/offres-emploi"
                className="inline-flex items-center gap-2 border-2 border-[var(--color-nuit)] text-[var(--color-nuit)] px-7 py-4 rounded-full font-semibold hover:bg-white transition-colors"
              >
                Voir les offres
              </Link>
            </div>
          </div>

          <div className="relative h-[420px] lg:h-[520px] rounded-3xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1000&auto=format&fit=crop&q=80"
              alt="Équipe professionnelle en réunion"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-nuit)]/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl p-5 flex items-center gap-4">
              <div className="flex -space-x-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80" alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="" className="w-10 h-10 rounded-full border-2 border-white object-cover" />
              </div>
              <p className="text-sm text-[var(--color-texte)] font-medium">
                Des centaines de candidats accompagnés depuis 2015
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0F1C3F] text-white mt-16">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <p className="font-[var(--font-display)] text-4xl font-extrabold" style={{ color: "#FF5A3C" }}>2015</p>
            <p className="text-sm text-white/70 mt-1">Année de création</p>
          </div>
          <div>
            <p className="font-[var(--font-display)] text-4xl font-extrabold" style={{ color: "#FF5A3C" }}>7</p>
            <p className="text-sm text-white/70 mt-1">Domaines d&apos;expertise</p>
          </div>
          <div>
            <p className="font-[var(--font-display)] text-4xl font-extrabold" style={{ color: "#FF5A3C" }}>100%</p>
            <p className="text-sm text-white/70 mt-1">Accompagnement local</p>
          </div>
          <div>
            <p className="font-[var(--font-display)] text-4xl font-extrabold" style={{ color: "#FF5A3C" }}>RH</p>
            <p className="text-sm text-white/70 mt-1">Notre cœur de métier</p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="font-[var(--font-display)] text-4xl font-extrabold text-[var(--color-nuit)] max-w-lg">
            Nos domaines d&apos;intervention
          </h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {domaines.map((d) => (
            <div
              key={d.titre}
              className="p-7 rounded-2xl bg-white border border-[var(--color-bordure)] hover:border-[var(--color-corail)] hover:-translate-y-1 transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-full bg-[var(--color-corail)]/10 flex items-center justify-center">
                <d.icon size={20} className="text-[var(--color-corail)]" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-[var(--color-nuit)]">
                {d.titre}
              </h3>
              <p className="mt-2 text-sm text-[var(--color-texte-doux)] leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="relative rounded-3xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1400&auto=format&fit=crop&q=80"
            alt="Bureau professionnel"
            className="w-full h-[380px] object-cover"
          />
          <div className="absolute inset-0 bg-[var(--color-nuit)]/80" />
          <div className="absolute inset-0 flex flex-col items-start justify-center px-10 md:px-16">
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-extrabold text-white max-w-lg">
              Besoin de recruter un collaborateur ?
            </h2>
            <p className="mt-4 text-white/80 max-w-md">
              Créez votre compte entreprise et accédez à la BTEC CVTHÈQUE
              pour consulter des profils qualifiés.
            </p>
            <Link
              href="/inscription"
              className="mt-8 inline-flex items-center gap-2 bg-[var(--color-corail)] text-white px-7 py-4 rounded-full font-semibold hover:bg-[var(--color-corail-fonce)] transition-colors"
            >
              Créer mon compte entreprise <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}