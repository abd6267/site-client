import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offre = await prisma.offreEmploi.findUnique({ where: { id } });

    if (!offre) {
      return NextResponse.json({ error: "Offre introuvable." }, { status: 404 });
    }

    return NextResponse.json(offre);
  } catch (error) {
    console.error("Erreur récupération offre :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue." },
      { status: 500 }
    );
  }
}