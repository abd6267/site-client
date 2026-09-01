import { ShieldCheck, Award, Lock, Zap, Lightbulb, HeartHandshake, Target, Eye } from "lucide-react";

const valeurs = [
  { icon: Award, label: "Professionnalisme" },
  { icon: ShieldCheck, label: "Intégrité" },
  { icon: Zap, label: "Excellence" },
  { icon: Lock, label: "Confidentialité" },
  { icon: Target, label: "Réactivité" },
  { icon: Lightbulb, label: "Innovation" },
  { icon: HeartHandshake, label: "Satisfaction client" },
];

export default function QuiSommesNous() {
  return (
    <>
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-16">
        <p className="text-sm text-[var(--color-ambre-fonce)] font-medium">
          Depuis 2015
        </p>
        <h1 className="font-[var(--font-display)] text-4xl md:text-5xl text-[var(--color-bleu-nuit)] mt-3">
          Qui sommes-nous ?
        </h1>
        <p className="mt-6 text-lg text-[var(--color-texte-doux)] leading-relaxed">
          BTEC BENIN — Best Technology Corporation — est un Cabinet
          spécialisé dans le recrutement, la gestion des ressources
          humaines, la formation professionnelle, le placement de
          personnel, la gestion déléguée du personnel, la communication et
          la publicité, ainsi que l&apos;événementiel. Nous accompagnons les
          entreprises dans l&apos;ensemble de leurs besoins en ressources
          humaines.
        </p>
      </section>

      <section className="bg-white border-y border-[var(--color-bordure)]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-bleu-nuit)]">
            Notre histoire
          </h2>
          <p className="mt-4 text-[var(--color-texte-doux)] leading-relaxed max-w-2xl">
            Depuis sa création en 2015, BTEC BENIN a accompagné un nombre
            croissant d&apos;entreprises dans leurs démarches de
            recrutement et de gestion des ressources humaines. Au fil des
            années, le Cabinet a élargi son champ d&apos;intervention pour
            répondre de manière toujours plus complète aux besoins de ses
            partenaires, en plaçant l&apos;exigence et la proximité au
            cœur de chaque mission.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 grid sm:grid-cols-2 gap-8">
        <div className="p-8 rounded-xl bg-[var(--color-bleu-nuit)] text-white">
          <Target size={26} className="text-[var(--color-ambre)]" />
          <h3 className="font-[var(--font-display)] text-xl mt-4">
            Notre mission
          </h3>
          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            Accompagner les entreprises et les candidats en offrant des
            services de recrutement et de gestion des ressources humaines
            fiables, professionnels et adaptés à chaque besoin.
          </p>
        </div>
        <div className="p-8 rounded-xl border border-[var(--color-bordure)] bg-white">
          <Eye size={26} className="text-[var(--color-ambre-fonce)]" />
          <h3 className="font-[var(--font-display)] text-xl mt-4 text-[var(--color-bleu-nuit)]">
            Notre vision
          </h3>
          <p className="mt-3 text-sm text-[var(--color-texte-doux)] leading-relaxed">
            Devenir la référence en matière de recrutement et de gestion
            des ressources humaines au Bénin, reconnue pour son
            professionnalisme et la qualité de son accompagnement.
          </p>
        </div>
      </section>

      <section className="bg-white border-y border-[var(--color-bordure)]">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="font-[var(--font-display)] text-2xl text-[var(--color-bleu-nuit)]">
            Nos valeurs
          </h2>
          <div className="mt-8 flex flex-wrap gap-4">
            {valeurs.map((v) => (
              <div
                key={v.label}
                className="flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--color-bordure)]"
              >
                <v.icon size={18} className="text-[var(--color-ambre-fonce)]" />
                <span className="text-sm text-[var(--color-texte)]">{v.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}