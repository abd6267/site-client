"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const liens = [
  { href: "/qui-sommes-nous", label: "Qui sommes-nous ?" },
  { href: "/offres-emploi", label: "Nos offres d'emploi" },
  { href: "/fiche-demande", label: "Fiche de demande" },
  { href: "/cvtheque", label: "BTEC CVTHÈQUE" },
  { href: "/nous-contacter", label: "Nous contacter" },
];

export default function Header() {
  const [ouvert, setOuvert] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-fond)]/95 backdrop-blur border-b border-[var(--color-bordure)]">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-[var(--font-display)] text-2xl font-semibold text-[var(--color-bleu-nuit)]">
            BTEC <span className="text-[var(--color-ambre-fonce)]">BENIN</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="text-sm text-[var(--color-texte-doux)] hover:text-[var(--color-bleu-nuit)] transition-colors"
            >
              {lien.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/connexion"
            className="text-sm text-[var(--color-bleu-nuit)] font-medium px-4 py-2"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="text-sm bg-[var(--color-bleu-nuit)] text-white px-5 py-2.5 rounded-md font-medium hover:bg-[var(--color-bleu-fonce)] transition-colors"
          >
            Compte Entreprise
          </Link>
        </div>

        <button
          onClick={() => setOuvert(!ouvert)}
          className="lg:hidden text-[var(--color-bleu-nuit)]"
          aria-label="Ouvrir le menu"
        >
          {ouvert ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {ouvert && (
        <nav className="lg:hidden px-6 pb-6 flex flex-col gap-4 border-t border-[var(--color-bordure)] pt-4">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              onClick={() => setOuvert(false)}
              className="text-[var(--color-texte-doux)]"
            >
              {lien.label}
            </Link>
          ))}
          <div className="flex flex-col gap-3 pt-2">
            <Link href="/connexion" className="text-[var(--color-bleu-nuit)] font-medium">
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="bg-[var(--color-bleu-nuit)] text-white px-5 py-2.5 rounded-md text-center font-medium"
            >
              Compte Entreprise
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}