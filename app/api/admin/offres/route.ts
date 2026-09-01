import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const offres = await prisma.offreEmploi.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(offres);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  try {
    const body = await request.json();

    const offre = await prisma.offreEmploi.create({
      data: {
        intitulePoste: body.intitulePoste,
        entrepriseNom: body.entrepriseNom || null,
        afficherNom: body.afficherNom ?? true,
        localisation: body.localisation,
        typeContrat: body.typeContrat,
        niveauEtude: body.niveauEtude,
        experience: body.experience,
        salaire: body.salaire || null,
        description: body.description,
        missions: body.missions,
        profilRecherche: body.profilRecherche,
        competences: body.competences,
        statut: body.statut || "BROUILLON",
        dateExpiration: body.dateExpiration ? new Date(body.dateExpiration) : null,
      },
    });

    return NextResponse.json(offre);
  } catch (error) {
    console.error("Erreur création offre :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}