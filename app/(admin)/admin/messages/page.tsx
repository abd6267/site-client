"use client";

import { useEffect, useState } from "react";
import { Mail, MailOpen, Archive, Trash2, Phone, Building2 } from "lucide-react";

type Message = {
  id: string;
  nomPrenom: string;
  nomEntreprise: string | null;
  telephone: string;
  email: string;
  objet: string;
  message: string;
  statut: string;
  createdAt: string;
};

const statutsInfo: Record<string, { label: string; couleur: string }> = {
  NON_LU: { label: "Non lu", couleur: "bg-blue-100 text-blue-800" },
  LU: { label: "Lu", couleur: "bg-gray-100 text-gray-800" },
  ARCHIVE: { label: "Archivé", couleur: "bg-gray-100 text-gray-500" },
};

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chargement, setChargement] = useState(true);
  const [filtre, setFiltre] = useState("TOUS");
  const [ouvert, setOuvert] = useState<string | null>(null);

  function chargerMessages() {
    setChargement(true);
    fetch("/api/admin/messages")
      .then((res) => res.json())
      .then((data) => setMessages(Array.isArray(data) ? data : []))
      .finally(() => setChargement(false));
  }

  useEffect(() => {
    chargerMessages();
  }, []);

  async function changerStatut(id: string, statut: string) {
    await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut }),
    });
    chargerMessages();
  }

  async function supprimerMessage(id: string) {
    if (!confirm("Supprimer définitivement ce message ?")) return;
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    chargerMessages();
  }

  function toggleOuvert(id: string, statutActuel: string) {
    setOuvert(ouvert === id ? null : id);
    if (statutActuel === "NON_LU") {
      changerStatut(id, "LU");
    }
  }

  const messagesFiltres =
    filtre === "TOUS" ? messages : messages.filter((m) => m.statut === filtre);

  return (
    <div>
      <h1 className="font-[var(--font-display)] text-3xl text-[var(--color-bleu-nuit)]">
        Messages reçus
      </h1>
      <p className="mt-2 text-[var(--color-texte-doux)]">
        {messages.filter((m) => m.statut === "NON_LU").length} message(s) non lu(s)
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {["TOUS", "NON_LU", "LU", "ARCHIVE"].map((s) => (
          <button
            key={s}
            onClick={() => setFiltre(s)}
            className={`text-sm px-4 py-2 rounded-full border transition-colors ${
              filtre === s
                ? "bg-[var(--color-bleu-nuit)] text-white border-[var(--color-bleu-nuit)]"
                : "border-[var(--color-bordure)] text-[var(--color-texte-doux)]"
            }`}
          >
            {s === "TOUS" ? "Tous" : statutsInfo[s].label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {chargement ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Chargement...</p>
        ) : messagesFiltres.length === 0 ? (
          <p className="text-sm text-[var(--color-texte-doux)]">Aucun message dans cette catégorie.</p>
        ) : (
          <div className="space-y-3">
            {messagesFiltres.map((m) => (
              <div
                key={m.id}
                className="bg-white border border-[var(--color-bordure)] rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleOuvert(m.id, m.statut)}
                  className="w-full flex flex-wrap items-center justify-between gap-3 p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    {m.statut === "NON_LU" ? (
                      <Mail size={18} className="text-[var(--color-bleu-nuit)] shrink-0" />
                    ) : (
                      <MailOpen size={18} className="text-[var(--color-texte-doux)] shrink-0" />
                    )}
                    <div>
                      <p className={`font-medium ${m.statut === "NON_LU" ? "text-[var(--color-bleu-nuit)]" : "text-[var(--color-texte)]"}`}>
                        {m.objet}
                      </p>
                      <p className="text-sm text-[var(--color-texte-doux)]">
                        {m.nomPrenom} {m.nomEntreprise && `· ${m.nomEntreprise}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${statutsInfo[m.statut].couleur}`}>
                      {statutsInfo[m.statut].label}
                    </span>
                    <span className="text-xs text-[var(--color-texte-doux)]">
                      {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </button>

                {ouvert === m.id && (
                  <div className="px-5 pb-5 border-t border-[var(--color-bordure)] pt-4">
                    <p className="text-sm text-[var(--color-texte)] leading-relaxed whitespace-pre-line">
                      {m.message}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--color-texte-doux)]">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} /> {m.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} /> {m.telephone}
                      </span>
                      {m.nomEntreprise && (
                        <span className="flex items-center gap-1.5">
                          <Building2 size={14} /> {m.nomEntreprise}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      {m.statut !== "ARCHIVE" && (
                        <button
                          onClick={() => changerStatut(m.id, "ARCHIVE")}
                          className="flex items-center gap-1.5 text-sm text-[var(--color-texte-doux)] px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <Archive size={16} /> Archiver
                        </button>
                      )}
                      <button
                        onClick={() => supprimerMessage(m.id)}
                        className="flex items-center gap-1.5 text-sm text-red-600 px-3 py-2 rounded-md hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={16} /> Supprimer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}