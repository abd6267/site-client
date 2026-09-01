"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

type Tarif = { type: string; duree: string; prix: number };

const formules = [
  { valeur: "BASIQUE", label: "Basique", description: "10 candidats consultables par jour" },
  { valeur: "PREMIUM", label: "Premium", description: "50% des candidats disponibles par jour" },
  { valeur: "VIP", label: "VIP", description: "100% des candidats disponibles par jour" },
];

const durees = [
  { valeur: "TRIMESTRIEL", label: "Trimestriel", sousLabel: "3 mois" },
  { valeur: "SEMESTRIEL", label: "Semestriel", sousLabel: "6 mois" },
  { valeur: "ANNUEL", label: "Annuel", sousLabel: "12 mois" },
];

export default function Abonnement() {
  const router = useRouter();
  const [tarifs, setTarifs] = useState<Tarif[]>([]);
  const [formuleChoisie, setFormuleChoisie] = useState("BASIQUE");
  const [dureeChoisie, setDureeChoisie] = useState("TRIMESTRIEL");
  const [chargement, setChargement] = useState(true);
  const [paiementEnCours, setPaiementEnCours] = useState(false);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    fetch("/api/admin/tarifs")
      .then((res) => res.json())
      .then((data) => setTarifs(Array.isArray(data) ? data : []))
      .finally(() => setChargement(false));
  }, []);

  function getPrix(type: string, duree: string) {
    const tarif = tarifs.find((t) => t.type === type && t.duree === duree);
    return tarif?.prix ?? null;
  }

  const prixActuel = getPrix(formuleChoisie, dureeChoisie);

  async function lancerPaiement() {
    setErreur("");
    if (!prixActuel) {
      setErreur("Ce tarif n'est pas encore configuré. Contactez BTEC BENIN.");
      return;
    }

    setPaiementEnCours(true);

    try {
      const res = await fetch("/api/paiements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: formuleChoisie, duree: dureeChoisie }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // TODO: Ouvrir le widget Kkiapay ici une fois les clés configurées
      // Pour l'instant, on simule la confirmation directement (À REMPLACER)
      const confirmRes = await fetch("/api/paiements/confirmer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paiementId: data.paiementId,
          type: formuleChoisie,
          duree: dureeChoisie,
        }),
      });

      if (!confirmRes.ok) throw new Error("Erreur lors de la confirmation du paiement.");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setErreur(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setPaiementEnCours(false);
    }
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-[var(--font-display)] text-4xl text-[var(--color-bleu-nuit)]">
        Choisir un abonnement CVTHÈQUE
      </h1>
      <p className="mt-3 text-[var(--color-texte-doux)]">
        Sélectionnez la formule et la durée qui correspondent à vos besoins de recrutement.
      </p>

      {chargement ? (
        <p className="mt-10 text-sm text-[var(--color-texte-doux)]">Chargement des tarifs...</p>
      ) : (
        <>
          <div className="mt-10 grid sm:grid-cols-3 gap-4">
            {formules.map((f) => (
              <button
                key={f.valeur}
                onClick={() => setFormuleChoisie(f.valeur)}
                className={`text-left p-5 rounded-xl border-2 transition-colors ${
                  formuleChoisie === f.valeur
                    ? "border-[var(--color-bleu-nuit)] bg-white"
                    : "border-[var(--color-bordure)] bg-white"
                }`}
              >
                <h2 className="font-medium text-[var(--color-bleu-nuit)]">{f.label}</h2>
                <p className="mt-1 text-sm text-[var(--color-texte-doux)]">{f.description}</p>
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {durees.map((d) => (
              <button
                key={d.valeur}
                onClick={() => setDureeChoisie(d.valeur)}
                className={`px-5 py-2.5 rounded-full text-sm border transition-colors ${
                  dureeChoisie === d.valeur
                    ? "bg-[var(--color-bleu-nuit)] text-white border-[var(--color-bleu-nuit)]"
                    : "border-[var(--color-bordure)] text-[var(--color-texte-doux)]"
                }`}
              >
                {d.label} ({d.sousLabel})
              </button>
            ))}
          </div>

          <div className="mt-10 p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-texte-doux)]">Total à payer</p>
                <p className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)] mt-1">
                  {prixActuel ? `${prixActuel.toLocaleString("fr-FR")} FCFA` : "Non disponible"}
                </p>
              </div>
              <button
                onClick={lancerPaiement}
                disabled={paiementEnCours || !prixActuel}
                className="flex items-center gap-2 bg-[var(--color-ambre-fonce)] text-white px-7 py-3.5 rounded-md font-medium hover:bg-[var(--color-ambre)] transition-colors disabled:opacity-60"
              >
                {paiementEnCours ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Traitement...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} /> Procéder au paiement
                  </>
                )}
              </button>
            </div>
            {erreur && <p className="mt-4 text-sm text-red-600">{erreur}</p>}
          </div>
        </>
      )}
    </section>
  );
}