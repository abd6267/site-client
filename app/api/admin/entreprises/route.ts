import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const entreprises = await prisma.entreprise.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      abonnements: {
        where: { statut: "ACTIF" },
        take: 1,
      },
    },
  });

  return NextResponse.json(entreprises);
}