import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);

  const dansUneSemaine = new Date();
  dansUneSemaine.setDate(dansUneSemaine.getDate() + 7);

  const [
    totalEntreprises,
    entreprisesValidees,
    entreprisesAbonnees,
    totalCandidats,
    offresActives,
    totalDemandes,
    messagesNonLus,
    abonnementsExpirantBientot,
    paiementsConfirmes,
  ] = await Promise.all([
    prisma.entreprise.count(),
    prisma.entreprise.count({ where: { statut: "VALIDE" } }),
    prisma.entreprise.count({
      where: { abonnements: { some: { statut: "ACTIF", dateExpiration: { gte: new Date() } } } },
    }),
    prisma.candidat.count({ where: { actif: true } }),
    prisma.offreEmploi.count({ where: { statut: "PUBLIEE" } }),
    prisma.demandeRecrutement.count(),
    prisma.messageContact.count({ where: { statut: "NON_LU" } }),
    prisma.abonnement.count({
      where: {
        statut: "ACTIF",
        dateExpiration: { gte: new Date(), lte: dansUneSemaine },
      },
    }),
    prisma.paiement.findMany({
      where: { statut: "CONFIRME", createdAt: { gte: debutMois } },
      select: { montant: true },
    }),
  ]);

  const chiffreAffairesMois = paiementsConfirmes.reduce((total, p) => total + p.montant, 0);

  const demandesParStatut = await prisma.demandeRecrutement.groupBy({
    by: ["statut"],
    _count: true,
  });

  return NextResponse.json({
    totalEntreprises,
    entreprisesValidees,
    entreprisesAbonnees,
    totalCandidats,
    offresActives,
    totalDemandes,
    messagesNonLus,
    abonnementsExpirantBientot,
    chiffreAffairesMois,
    demandesParStatut,
  });
}