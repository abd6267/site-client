import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.entrepriseId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  const entrepriseId = session.user.entrepriseId;

  const entreprise = await prisma.entreprise.findUnique({
    where: { id: entrepriseId },
  });

  if (!entreprise || entreprise.statut !== "VALIDE") {
    return NextResponse.json({ error: "Compte non validé." }, { status: 403 });
  }

  const abonnementActif = await prisma.abonnement.findFirst({
    where: {
      entrepriseId,
      statut: "ACTIF",
      dateExpiration: { gte: new Date() },
    },
    orderBy: { dateExpiration: "desc" },
  });

  if (!abonnementActif) {
    return NextResponse.json({ error: "Aucun abonnement actif." }, { status: 403 });
  }

  const candidat = await prisma.candidat.findUnique({ where: { id } });
  if (!candidat || !candidat.actif) {
    return NextResponse.json({ error: "Candidat introuvable." }, { status: 404 });
  }

  const debutJournee = new Date();
  debutJournee.setHours(0, 0, 0, 0);

  const dejaConsulte = await prisma.consultationCandidat.findFirst({
    where: {
      entrepriseId,
      candidatId: id,
      dateConsultation: { gte: debutJournee },
    },
  });

  // Si pas déjà consulté aujourd'hui, vérifier le quota avant d'autoriser
  if (!dejaConsulte) {
    const consultationsAujourdhui = await prisma.consultationCandidat.count({
      where: { entrepriseId, dateConsultation: { gte: debutJournee } },
    });

    let quotaJournalier = 0;
    if (abonnementActif.type === "VIP") {
      quotaJournalier = await prisma.candidat.count({ where: { actif: true } });
    } else if (abonnementActif.type === "PREMIUM") {
      const total = await prisma.candidat.count({ where: { actif: true } });
      quotaJournalier = Math.floor(total * 0.5);
    } else {
      quotaJournalier = 10;
    }

    if (consultationsAujourdhui >= quotaJournalier) {
      return NextResponse.json(
        {
          error: "Vous avez atteint votre limite quotidienne de consultation. Votre quota sera renouvelé demain.",
        },
        { status: 429 }
      );
    }

    await prisma.consultationCandidat.create({
      data: { entrepriseId, candidatId: id },
    });
  }

  return NextResponse.json({
    id: candidat.id,
    reference: candidat.reference,
    nom: candidat.nom,
    prenom: candidat.prenom,
    photoUrl: candidat.photoUrl,
    cvUrl: candidat.cvUrl,
    posteRecherche: candidat.posteRecherche,
    domaine: candidat.domaine,
    niveauEtude: candidat.niveauEtude,
    experience: candidat.experience,
    localisation: candidat.localisation,
    disponibilite: candidat.disponibilite,
    competences: candidat.competences,
    typeProfil: candidat.typeProfil,
  });
}