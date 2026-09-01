import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nomPrenom, nomEntreprise, telephone, email, objet, message } = body;

    if (!nomPrenom || !telephone || !email || !objet || !message) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
        { status: 400 }
      );
    }

    const nouveauMessage = await prisma.messageContact.create({
      data: { nomPrenom, nomEntreprise, telephone, email, objet, message },
    });

    return NextResponse.json({ success: true, id: nouveauMessage.id });
  } catch (error) {
    console.error("Erreur formulaire contact :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}