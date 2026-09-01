import FormulaireCandidat from "@/components/FormulaireCandidat";

export default function NouveauCandidat() {
  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Ajouter un candidat
      </h1>
      <div className="mt-8 max-w-3xl">
        <FormulaireCandidat />
      </div>
    </div>
  );
}