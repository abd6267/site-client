import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { envoyerEmailInscription } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nomEntreprise,
      nomPromoteur,
      activites,
      situationGeo,
      rccm,
      ifu,
      telephone,
      email,
      motDePasse,
      confirmationMotDePasse,
    } = body;

    const champsObligatoires = {
      nomEntreprise, nomPromoteur, activites, situationGeo,
      rccm, ifu, telephone, email, motDePasse, confirmationMotDePasse,
    };

    for (const [cle, valeur] of Object.entries(champsObligatoires)) {
      if (!valeur) {
        return NextResponse.json(
          { error: `Le champ "${cle}" est requis.` },
          { status: 400 }
        );
      }
    }

    if (motDePasse !== confirmationMotDePasse) {
      return NextResponse.json(
        { error: "Les mots de passe ne correspondent pas." },
        { status: 400 }
      );
    }

    if (motDePasse.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const utilisateurExistant = await prisma.utilisateur.findUnique({
      where: { email },
    });

    if (utilisateurExistant) {
      return NextResponse.json(
        { error: "Un compte existe déjà avec cette adresse e-mail." },
        { status: 409 }
      );
    }

    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    const utilisateur = await prisma.utilisateur.create({
      data: {
        email,
        motDePasse: motDePasseHash,
        role: "ENTREPRISE",
        entreprise: {
          create: {
            nomEntreprise,
            nomPromoteur,
            activites,
            situationGeo,
            rccm,
            ifu,
            telephone,
            email,
            statut: "EN_ATTENTE",
          },
        },
      },
      include: { entreprise: true },
    });

    await envoyerEmailInscription({
      destinataire: email,
      nomEntreprise,
    });

    return NextResponse.json({
      success: true,
      message: "Votre compte a été créé et est en attente de validation.",
      id: utilisateur.id,
    });
  } catch (error) {
    console.error("Erreur inscription entreprise :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}