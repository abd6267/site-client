import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const tarifs = await prisma.tarifAbonnement.findMany();
  return NextResponse.json(tarifs);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { type, duree, prix } = body;

    const tarif = await prisma.tarifAbonnement.upsert({
      where: { type_duree: { type, duree } },
      update: { prix: parseInt(prix) },
      create: { type, duree, prix: parseInt(prix) },
    });

    return NextResponse.json(tarif);
  } catch (error) {
    console.error("Erreur tarif :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}