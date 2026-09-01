import FormulaireOffre from "@/components/FormulaireOffre";

export default function NouvelleOffre() {
  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Nouvelle offre d&apos;emploi
      </h1>
      <div className="mt-8 max-w-3xl">
        <FormulaireOffre />
      </div>
    </div>
  );
}