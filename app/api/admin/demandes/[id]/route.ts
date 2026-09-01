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
  const demande = await prisma.demandeRecrutement.findUnique({ where: { id } });

  if (!demande) {
    return NextResponse.json({ error: "Demande introuvable." }, { status: 404 });
  }

  return NextResponse.json(demande);
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

  const statutsValides = ["NOUVELLE", "EN_COURS", "VALIDEE", "RECRUTEMENT_EN_COURS", "CLOTUREE"];
  if (body.statut && !statutsValides.includes(body.statut)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const donnees: Record<string, unknown> = {};
  if (body.statut) donnees.statut = body.statut;
  if (body.observations !== undefined) donnees.observations = body.observations;

  const demande = await prisma.demandeRecrutement.update({
    where: { id },
    data: donnees,
  });

  return NextResponse.json(demande);
}