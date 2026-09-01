import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function genererReferenceCandidat() {
  const aleatoire = Math.floor(10000 + Math.random() * 90000);
  return `CV-${aleatoire}`;
}

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const candidats = await prisma.candidat.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(candidats);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  try {
    const body = await request.json();

    let reference = genererReferenceCandidat();
    let existe = await prisma.candidat.findUnique({ where: { reference } });
    while (existe) {
      reference = genererReferenceCandidat();
      existe = await prisma.candidat.findUnique({ where: { reference } });
    }

    const candidat = await prisma.candidat.create({
      data: {
        reference,
        nom: body.nom,
        prenom: body.prenom,
        photoUrl: body.photoUrl || null,
        cvUrl: body.cvUrl || null,
        posteRecherche: body.posteRecherche,
        domaine: body.domaine,
        niveauEtude: body.niveauEtude,
        experience: body.experience,
        localisation: body.localisation,
        disponibilite: body.disponibilite,
        competences: body.competences,
        typeProfil: body.typeProfil || null,
        confidentiel: body.confidentiel ?? true,
        actif: body.actif ?? true,
      },
    });

    return NextResponse.json(candidat);
  } catch (error) {
    console.error("Erreur création candidat :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}