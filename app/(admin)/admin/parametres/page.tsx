"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";

type Tarif = { type: string; duree: string; prix: number };

const types = [
  { valeur: "BASIQUE", label: "Basique" },
  { valeur: "PREMIUM", label: "Premium" },
  { valeur: "VIP", label: "VIP" },
];

const durees = [
  { valeur: "TRIMESTRIEL", label: "Trimestriel (3 mois)" },
  { valeur: "SEMESTRIEL", label: "Semestriel (6 mois)" },
  { valeur: "ANNUEL", label: "Annuel (12 mois)" },
];

export default function AdminParametres() {
  const [tarifs, setTarifs] = useState<Record<string, number>>({});
  const [chargement, setChargement] = useState(true);
  const [enregistrement, setEnregistrement] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/tarifs")
      .then((res) => res.json())
      .then((data: Tarif[]) => {
        const map: Record<string, number> = {};
        data.forEach((t) => {
          map[`${t.type}_${t.duree}`] = t.prix;
        });
        setTarifs(map);
      })
      .finally(() => setChargement(false));
  }, []);

  async function enregistrerTarif(type: string, duree: string) {
    const cle = `${type}_${duree}`;
    const prix = tarifs[cle];
    if (!prix) return;

    setEnregistrement(cle);
    await fetch("/api/admin/tarifs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, duree, prix }),
    });
    setEnregistrement(null);
  }

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Paramètres — Grille tarifaire
      </h1>
      <p className="mt-2 text-[var(--color-texte-doux)]">
        Définissez les tarifs des abonnements CVTHÈQUE (en FCFA).
      </p>

      {chargement ? (
        <p className="mt-8 text-sm text-[var(--color-texte-doux)]">Chargement...</p>
      ) : (
        <div className="mt-8 space-y-8">
          {types.map((t) => (
            <div key={t.valeur} className="p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
              <h2 className="font-medium text-[var(--color-bleu-nuit)]">{t.label}</h2>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                {durees.map((d) => {
                  const cle = `${t.valeur}_${d.valeur}`;
                  return (
                    <div key={cle}>
                      <label className="text-xs text-[var(--color-texte-doux)]">{d.label}</label>
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="number"
                          value={tarifs[cle] || ""}
                          onChange={(e) =>
                            setTarifs({ ...tarifs, [cle]: parseInt(e.target.value) || 0 })
                          }
                          placeholder="FCFA"
                          className="flex-1 border border-[var(--color-bordure)] rounded-md px-3 py-2 text-sm outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
                        />
                        <button
                          onClick={() => enregistrerTarif(t.valeur, d.valeur)}
                          disabled={enregistrement === cle}
                          className="bg-[var(--color-bleu-nuit)] text-white px-3 py-2 rounded-md hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
                        >
                          <Save size={16} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}