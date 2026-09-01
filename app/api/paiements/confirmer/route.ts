import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { envoyerEmailConfirmationAbonnement } from "@/lib/email";

function calculerDateExpiration(duree: string): Date {
  const date = new Date();
  if (duree === "TRIMESTRIEL") date.setMonth(date.getMonth() + 3);
  else if (duree === "SEMESTRIEL") date.setMonth(date.getMonth() + 6);
  else if (duree === "ANNUEL") date.setMonth(date.getMonth() + 12);
  return date;
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.entrepriseId) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { paiementId, type, duree } = body;

    // TODO: Vérifier la transaction côté serveur avec le SDK Kkiapay
    // avant de confirmer (voir étape suivante une fois les clés disponibles)

    const paiement = await prisma.paiement.update({
      where: { id: paiementId },
      data: { statut: "CONFIRME", modePaiement: "Kkiapay" },
    });

    const dateExpiration = calculerDateExpiration(duree);

    const abonnement = await prisma.abonnement.create({
      data: {
        entrepriseId: session.user.entrepriseId,
        type,
        duree,
        statut: "ACTIF",
        dateExpiration,
      },
    });

    await prisma.paiement.update({
      where: { id: paiement.id },
      data: { abonnementId: abonnement.id },
    });

    const entreprise = await prisma.entreprise.findUnique({
      where: { id: session.user.entrepriseId },
    });

    if (entreprise) {
      await envoyerEmailConfirmationAbonnement({
        destinataire: entreprise.email,
        nomEntreprise: entreprise.nomEntreprise,
        type,
        duree,
        dateExpiration: dateExpiration.toLocaleDateString("fr-FR"),
      });
    }

    return NextResponse.json({ success: true, abonnementId: abonnement.id });
  } catch (error) {
    console.error("Erreur confirmation paiement :", error);
    return NextResponse.json({ error: "Une erreur est survenue." }, { status: 500 });
  }
}