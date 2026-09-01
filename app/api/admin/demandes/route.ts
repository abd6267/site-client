import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé." }, { status: 403 });
  }

  const demandes = await prisma.demandeRecrutement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(demandes);
}