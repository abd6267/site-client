import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import DocumentDemande from "@/lib/pdf-demande";
import { envoyerEmailDemande } from "@/lib/email";

function genererReference() {
  const annee = new Date().getFullYear();
  const aleatoire = Math.floor(1000 + Math.random() * 9000);
  return `BTEC-${annee}-${aleatoire}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const champsObligatoires = [
      "nomEntreprise",
      "activites",
      "situationGeo",
      "rccm",
      "ifu",
      "telephone",
      "email",
      "posteRecherche",
      "nombrePersonnes",
      "profilCandidat",
      "niveauEtude",
      "experience",
      "competences",
      "grilleSalariale",
      "horaireService",
      "typeContrat",
      "dureeContrat",
      "datePriseFonction",
    ];

    for (const champ of champsObligatoires) {
      if (!body[champ]) {
        return NextResponse.json(
          { error: `Le champ "${champ}" est requis.` },
          { status: 400 }
        );
      }
    }

    let reference = genererReference();
    let existe = await prisma.demandeRecrutement.findUnique({
      where: { reference },
    });
    while (existe) {
      reference = genererReference();
      existe = await prisma.demandeRecrutement.findUnique({
        where: { reference },
      });
    }

    const demande = await prisma.demandeRecrutement.create({
      data: {
        reference,
        nomEntreprise: body.nomEntreprise,
        activites: body.activites,
        situationGeo: body.situationGeo,
        rccm: body.rccm,
        ifu: body.ifu,
        telephone: body.telephone,
        email: body.email,
        posteRecherche: body.posteRecherche,
        nombrePersonnes: parseInt(body.nombrePersonnes),
        profilCandidat: body.profilCandidat,
        niveauEtude: body.niveauEtude,
        experience: body.experience,
        competences: body.competences,
        grilleSalariale: body.grilleSalariale,
        horaireService: body.horaireService,
        typeContrat: body.typeContrat,
        dureeContrat: body.dureeContrat,
        datePriseFonction: new Date(body.datePriseFonction),
        observations: body.observations || null,
      },
    });

    const pdfBuffer = await renderToBuffer(
      DocumentDemande({
        reference: demande.reference,
        dateCreation: new Date(demande.createdAt).toLocaleDateString("fr-FR"),
        nomEntreprise: demande.nomEntreprise,
        activites: demande.activites,
        situationGeo: demande.situationGeo,
        rccm: demande.rccm,
        ifu: demande.ifu,
        telephone: demande.telephone,
        email: demande.email,
        posteRecherche: demande.posteRecherche,
        nombrePersonnes: demande.nombrePersonnes,
        profilCandidat: demande.profilCandidat,
        niveauEtude: demande.niveauEtude,
        experience: demande.experience,
        competences: demande.competences,
        grilleSalariale: demande.grilleSalariale,
        horaireService: demande.horaireService,
        typeContrat: demande.typeContrat,
        dureeContrat: demande.dureeContrat,
        datePriseFonction: new Date(demande.datePriseFonction).toLocaleDateString(
          "fr-FR"
        ),
        observations: demande.observations || undefined,
      })
    );

    await envoyerEmailDemande({
      destinataire: demande.email,
      nomEntreprise: demande.nomEntreprise,
      reference: demande.reference,
      pdfBuffer,
    });

    return NextResponse.json({
      success: true,
      reference: demande.reference,
      id: demande.id,
    });
  } catch (error) {
    console.error("Erreur création demande :", error);
    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    );
  }
}