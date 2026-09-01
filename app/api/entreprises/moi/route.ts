import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const QUOTAS: Record<string, number> = {
  BASIQUE: 10,
};

export async function GET() {
  const session = await auth();

  if (!session?.user?.entrepriseId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const entreprise = await prisma.entreprise.findUnique({
    where: { id: session.user.entrepriseId },
    include: {
      abonnements: {
        where: { statut: "ACTIF" },
        orderBy: { dateExpiration: "desc" },
        take: 1,
      },
    },
  });

  if (!entreprise) {
    return NextResponse.json({ error: "Entreprise introuvable." }, { status: 404 });
  }

  const abonnementActif = entreprise.abonnements[0] || null;

  let consultationsAujourdhui = 0;
  let quotaJournalier = 0;

  if (abonnementActif) {
    const debutJournee = new Date();
    debutJournee.setHours(0, 0, 0, 0);

    consultationsAujourdhui = await prisma.consultationCandidat.count({
      where: {
        entrepriseId: entreprise.id,
        dateConsultation: { gte: debutJournee },
      },
    });

    if (abonnementActif.type === "VIP") {
      quotaJournalier = await prisma.candidat.count({ where: { actif: true } });
    } else if (abonnementActif.type === "PREMIUM") {
      const totalCandidats = await prisma.candidat.count({ where: { actif: true } });
      quotaJournalier = Math.floor(totalCandidats * 0.5);
    } else {
      quotaJournalier = QUOTAS.BASIQUE;
    }
  }

  return NextResponse.json({
    entreprise: {
      nomEntreprise: entreprise.nomEntreprise,
      email: entreprise.email,
      statut: entreprise.statut,
    },
    abonnement: abonnementActif,
    consultationsAujourdhui,
    quotaJournalier,
  });
}