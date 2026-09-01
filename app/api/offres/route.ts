import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const recherche = searchParams.get("recherche") || "";
    const localisation = searchParams.get("localisation") || "";
    const typeContrat = searchParams.get("typeContrat") || "";

    const offres = await prisma.offreEmploi.findMany({
      where: {
        statut: "PUBLIEE",
        ...(recherche && {
          intitulePoste: { contains: recherche, mode: "insensitive" },
        }),
        ...(localisation && {
          localisation: { contains: localisation, mode: "insensitive" },
        }),
        ...(typeContrat && { typeContrat }),
      },
      orderBy: { datePublication: "desc" },
    });

    return NextResponse.json(offres);
  } catch (error) {
    console.error("Erreur récupération offres :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les offres." },
      { status: 500 }
    );
  }
}