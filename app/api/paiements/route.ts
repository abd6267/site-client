import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function genererReferencePaiement() {
  const aleatoire = Math.floor(100000 + Math.random() * 900000);
  return `PAY-${aleatoire}`;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.entrepriseId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { type, duree } = body;

    const tarif = await prisma.tarifAbonnement.findUnique({
      where: { type_duree: { type, duree } },
    });

    if (!tarif) {
      return NextResponse.json({ error: "Tarif introuvable pour cette formule." }, { status: 404 });
    }

    let reference = genererReferencePaiement();
    let existe = await prisma.paiement.findUnique({ where: { reference } });
    while (existe) {
      reference = genererReferencePaiement();
      existe = await prisma.paiement.findUnique({ where: { reference } });
    }

    const paiement = await prisma.paiement.create({
      data: {
        entrepriseId: session.user.entrepriseId,
        montant: tarif.prix,
        reference,
        statut: "EN_ATTENTE",
      },
    });

    return NextResponse.json({
      paiementId: paiement.id,
      reference: paiement.reference,
      montant: paiement.montant,
    });
  } catch (error) {
    console.error("Erreur initiation paiement :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}