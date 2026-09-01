import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.entrepriseId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const entreprise = await prisma.entreprise.findUnique({
    where: { id: session.user.entrepriseId },
  });

  if (!entreprise || entreprise.statut !== "VALIDE") {
    return NextResponse.json({ error: "Compte non validé." }, { status: 403 });
  }

  const abonnementActif = await prisma.abonnement.findFirst({
    where: {
      entrepriseId: entreprise.id,
      statut: "ACTIF",
      dateExpiration: { gte: new Date() },
    },
    orderBy: { dateExpiration: "desc" },
  });

  if (!abonnementActif) {
    return NextResponse.json({ error: "Aucun abonnement actif." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const recherche = searchParams.get("recherche") || "";
  const domaine = searchParams.get("domaine") || "";
  const niveauEtude = searchParams.get("niveauEtude") || "";
  const localisation = searchParams.get("localisation") || "";
  const disponibilite = searchParams.get("disponibilite") || "";

  const candidats = await prisma.candidat.findMany({
    where: {
      actif: true,
      ...(recherche && {
        OR: [
          { posteRecherche: { contains: recherche, mode: "insensitive" } },
          { reference: { contains: recherche, mode: "insensitive" } },
          { competences: { contains: recherche, mode: "insensitive" } },
        ],
      }),
      ...(domaine && { domaine: { contains: domaine, mode: "insensitive" } }),
      ...(niveauEtude && { niveauEtude: { contains: niveauEtude, mode: "insensitive" } }),
      ...(localisation && { localisation: { contains: localisation, mode: "insensitive" } }),
      ...(disponibilite && { disponibilite: { contains: disponibilite, mode: "insensitive" } }),
    },
    orderBy: { createdAt: "desc" },
  });

  const debutJournee = new Date();
  debutJournee.setHours(0, 0, 0, 0);

  const consultationsAujourdhui = await prisma.consultationCandidat.findMany({
    where: {
      entrepriseId: entreprise.id,
      dateConsultation: { gte: debutJournee },
    },
    select: { candidatId: true },
  });

  const idsConsultes = new Set(consultationsAujourdhui.map((c) => c.candidatId));

  const resultats = candidats.map((c) => ({
    id: c.id,
    reference: c.reference,
    nom: idsConsultes.has(c.id) || !c.confidentiel ? c.nom : null,
    prenom: idsConsultes.has(c.id) || !c.confidentiel ? c.prenom : null,
    photoUrl: c.photoUrl,
    posteRecherche: c.posteRecherche,
    domaine: c.domaine,
    niveauEtude: c.niveauEtude,
    experience: c.experience,
    localisation: c.localisation,
    disponibilite: c.disponibilite,
    dejaConsulte: idsConsultes.has(c.id),
  }));

  return NextResponse.json(resultats);
}