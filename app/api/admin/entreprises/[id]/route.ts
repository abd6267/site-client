import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailValidationCompte, envoyerEmailRejetCompte } from "@/lib/email";

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
  const { statut } = body;

  const statutsValides = ["EN_ATTENTE", "VALIDE", "REJETE", "SUSPENDU", "DESACTIVE"];
  if (!statutsValides.includes(statut)) {
    return NextResponse.json({ error: "Statut invalide." }, { status: 400 });
  }

  const entreprise = await prisma.entreprise.update({
    where: { id },
    data: { statut },
  });

  if (statut === "VALIDE") {
    await envoyerEmailValidationCompte({
      destinataire: entreprise.email,
      nomEntreprise: entreprise.nomEntreprise,
    });
  } else if (statut === "REJETE") {
    await envoyerEmailRejetCompte({
      destinataire: entreprise.email,
      nomEntreprise: entreprise.nomEntreprise,
    });
  }

  return NextResponse.json(entreprise);
}