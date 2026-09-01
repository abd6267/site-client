import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const offre = await prisma.offreEmploi.findUnique({ where: { id } });

  if (!offre) {
    return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
  }

  return NextResponse.json(offre);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const donnees: Record<string, unknown> = {};
  const champsAutorises = [
    "intitulePoste", "entrepriseNom", "afficherNom", "localisation",
    "typeContrat", "niveauEtude", "experience", "salaire", "description",
    "missions", "profilRecherche", "competences", "statut",
  ];

  for (const champ of champsAutorises) {
    if (body[champ] !== undefined) donnees[champ] = body[champ];
  }

  if (body.dateExpiration !== undefined) {
    donnees.dateExpiration = body.dateExpiration ? new Date(body.dateExpiration) : null;
  }

  const offre = await prisma.offreEmploi.update({
    where: { id },
    data: donnees,
  });

  return NextResponse.json(offre);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const { id } = await params;
  await prisma.offreEmploi.delete({ where: { id } });

  return NextResponse.json({ success: true });
}