import Link from "next/link";
import { Building2, Users, Briefcase, FileText, MessageSquare, Settings, LayoutGrid } from "lucide-react";

const liens = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutGrid },
  { href: "/admin/entreprises", label: "Entreprises", icon: Building2 },
  { href: "/admin/candidats", label: "Candidats (CVTHÈQUE)", icon: Users },
  { href: "/admin/offres", label: "Offres d'emploi", icon: Briefcase },
  { href: "/admin/demandes", label: "Demandes de recrutement", icon: FileText },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/parametres", label: "Paramètres", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[240px_1fr] gap-10">
      <aside className="lg:sticky lg:top-24 h-fit">
        <p className="text-xs font-medium text-[var(--color-ambre-fonce)] uppercase tracking-wide px-3">
          Back-office BTEC
        </p>
        <nav className="mt-4 flex flex-col gap-1">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[var(--color-texte-doux)] hover:bg-white hover:text-[var(--color-bleu-nuit)] transition-colors"
            >
              <lien.icon size={18} />
              {lien.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}