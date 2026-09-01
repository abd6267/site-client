"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Briefcase } from "lucide-react";

type Demande = {
  reference: string;
  nomEntreprise: string;
  activites: string;
  situationGeo: string;
  rccm: string;
  ifu: string;
  telephone: string;
  email: string;
  posteRecherche: string;
  nombrePersonnes: number;
  profilCandidat: string;
  niveauEtude: string;
  experience: string;
  competences: string;
  grilleSalariale: string;
  horaireService: string;
  typeContrat: string;
  dureeContrat: string;
  datePriseFonction: string;
  observations: string | null;
  statut: string;
  createdAt: string;
};

const statuts = [
  { valeur: "NOUVELLE", label: "Nouvelle demande" },
  { valeur: "EN_COURS", label: "En cours de traitement" },
  { valeur: "VALIDEE", label: "Validée" },
  { valeur: "RECRUTEMENT_EN_COURS", label: "Recrutement en cours" },
  { valeur: "CLOTUREE", label: "Clôturée" },
];

export default function DetailDemande() {
  const { id } = useParams<{ id: string }>();
  const [demande, setDemande] = useState<Demande | null>(null);
  const [chargement, setChargement] = useState(true);
  const [observations, setObservations] = useState("");
  const [enregistrement, setEnregistrement] = useState(false);

  function charger() {
    fetch(`/api/admin/demandes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setDemande(data);
        setObservations(data.observations || "");
      })
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    charger();
  }, [id]);

  async function changerStatut(statut: string) {
    await fetch(`/api/admin/demandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    charger();
  }

  async function enregistrerObservations() {
    setEnregistrement(true);
    await fetch(`/api/admin/demandes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ observations }),
    });
    setEnregistrement(false);
  }

  if (chargement) return <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>;
  if (!demande) return <p className="text-sm text-[var(--color-texte-doux)]">Demande introuvable.</p>;

  return (
    <div>
      <Link
        href="/admin/demandes"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-texte-doux)] hover:text-[var(--color-bleu-nuit)]"
      >
        <ArrowLeft size={16} /> Retour aux demandes
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
            {demande.nomEntreprise}
          </h1>
          <p className="mt-1 text-sm text-[var(--color-texte-doux)]">
            Réf. {demande.reference} · Reçue le {new Date(demande.createdAt).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <select
          value={demande.statut}
          onChange={(e) => changerStatut(e.target.value)}
          className="border border-[var(--color-bordure)] rounded-md px-4 py-2.5 text-sm outline-none focus:border-[var(--color-bleu-nuit)] bg-white"
        >
          {statuts.map((s) => (
            <option key={s.valeur} value={s.valeur}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
          <div className="flex items-center gap-2 text-[var(--color-bleu-nuit)]">
            <Building2 size={18} />
            <h2 className="font-medium">Informations sur l&apos;entreprise</h2>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <Ligne label="Activités" valeur={demande.activites} />
            <Ligne label="Situation géographique" valeur={demande.situationGeo} />
            <Ligne label="RCCM" valeur={demande.rccm} />
            <Ligne label="IFU" valeur={demande.ifu} />
            <Ligne label="Téléphone" valeur={demande.telephone} />
            <Ligne label="E-mail" valeur={demande.email} />
          </dl>
        </div>

        <div className="p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
          <div className="flex items-center gap-2 text-[var(--color-bleu-nuit)]">
            <Briefcase size={18} />
            <h2 className="font-medium">Informations sur le recrutement</h2>
          </div>
          <dl className="mt-4 space-y-3 text-sm">
            <Ligne label="Poste recherché" valeur={demande.posteRecherche} />
            <Ligne label="Nombre de personnes" valeur={String(demande.nombrePersonnes)} />
            <Ligne label="Profil du candidat" valeur={demande.profilCandidat} />
            <Ligne label="Niveau d'étude" valeur={demande.niveauEtude} />
            <Ligne label="Expérience souhaitée" valeur={demande.experience} />
            <Ligne label="Compétences recherchées" valeur={demande.competences} />
            <Ligne label="Grille salariale" valeur={demande.grilleSalariale} />
            <Ligne label="Horaire de service" valeur={demande.horaireService} />
            <Ligne label="Type de contrat" valeur={demande.typeContrat} />
            <Ligne label="Durée du contrat" valeur={demande.dureeContrat} />
            <Ligne
              label="Date souhaitée de prise de fonction"
              valeur={new Date(demande.datePriseFonction).toLocaleDateString("fr-FR")}
            />
          </dl>
        </div>
      </div>

      <div className="mt-6 p-6 bg-white border border-[var(--color-bordure)] rounded-xl">
        <h2 className="font-medium text-[var(--color-bleu-nuit)]">
          Observations internes (équipe BTEC)
        </h2>
        <textarea
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          rows={4}
          className="mt-3 w-full border border-[var(--color-bordure)] rounded-md px-4 py-2.5 outline-none focus:border-[var(--color-bleu-nuit)] resize-none bg-white text-sm"
          placeholder="Ajouter des notes de suivi sur cette demande..."
        />
        <button
          onClick={enregistrerObservations}
          disabled={enregistrement}
          className="mt-3 bg-[var(--color-bleu-nuit)] text-white px-5 py-2.5 rounded-md text-sm font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors disabled:opacity-60"
        >
          {enregistrement ? "Enregistrement..." : "Enregistrer les observations"}
        </button>
      </div>
    </div>
  );
}

function Ligne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <div>
      <dt className="text-xs text-[var(--color-texte-doux)]">{label}</dt>
      <dd className="mt-0.5 text-[var(--color-texte)]">{valeur}</dd>
    </div>
  );
}