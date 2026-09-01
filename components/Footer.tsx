import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-bleu-nuit)] text-white mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div>
          <h3 className="font-[var(--font-display)] text-xl mb-4">
            BTEC <span className="text-[var(--color-ambre)]">BENIN</span>
          </h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Best Technology Corporation — Cabinet de recrutement et de
            gestion des ressources humaines depuis 2015.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[var(--color-ambre)] mb-4">
            Navigation
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/qui-sommes-nous" className="hover:text-white transition-colors">Qui sommes-nous ?</Link></li>
            <li><Link href="/offres-emploi" className="hover:text-white transition-colors">Nos offres d&apos;emploi</Link></li>
            <li><Link href="/fiche-demande" className="hover:text-white transition-colors">Fiche de demande</Link></li>
            <li><Link href="/cvtheque" className="hover:text-white transition-colors">BTEC CVTHÈQUE</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[var(--color-ambre)] mb-4">
            Espace Entreprise
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li><Link href="/inscription" className="hover:text-white transition-colors">Créer un compte</Link></li>
            <li><Link href="/connexion" className="hover:text-white transition-colors">Connexion</Link></li>
            <li><Link href="/nous-contacter" className="hover:text-white transition-colors">Nous contacter</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-[var(--color-ambre)] mb-4">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0" />
              <span>Cotonou, Bénin</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0" />
              <span>+229 01 66 37 54 68</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0" />
              <span>btecbenin@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <p className="text-center text-xs text-white/50">
          © {new Date().getFullYear()} BTEC BENIN — Best Technology Corporation. Tous droits réservés.
        </p>
        <p className="text-center mt-2">
          <Link href="/admin/connexion" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
            Espace administrateur
          </Link>
        </p>
      </div>
    </footer>
  );
}