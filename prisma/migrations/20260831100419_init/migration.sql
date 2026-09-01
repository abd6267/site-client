-- CreateEnum
CREATE TYPE "RoleUtilisateur" AS ENUM ('ADMIN', 'ENTREPRISE');

-- CreateEnum
CREATE TYPE "StatutEntreprise" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REJETE', 'SUSPENDU', 'DESACTIVE');

-- CreateEnum
CREATE TYPE "TypeAbonnement" AS ENUM ('BASIQUE', 'PREMIUM', 'VIP');

-- CreateEnum
CREATE TYPE "DureeAbonnement" AS ENUM ('TRIMESTRIEL', 'SEMESTRIEL', 'ANNUEL');

-- CreateEnum
CREATE TYPE "StatutAbonnement" AS ENUM ('ACTIF', 'EXPIRE', 'ANNULE');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'CONFIRME', 'ECHOUE');

-- CreateEnum
CREATE TYPE "StatutOffre" AS ENUM ('BROUILLON', 'PUBLIEE', 'DESACTIVEE', 'EXPIREE');

-- CreateEnum
CREATE TYPE "StatutDemande" AS ENUM ('NOUVELLE', 'EN_COURS', 'VALIDEE', 'RECRUTEMENT_EN_COURS', 'CLOTUREE');

-- CreateEnum
CREATE TYPE "StatutMessage" AS ENUM ('NON_LU', 'LU', 'ARCHIVE');

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "RoleUtilisateur" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entreprise" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "nomPromoteur" TEXT NOT NULL,
    "activites" TEXT NOT NULL,
    "situationGeo" TEXT NOT NULL,
    "rccm" TEXT NOT NULL,
    "ifu" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "statut" "StatutEntreprise" NOT NULL DEFAULT 'EN_ATTENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entreprise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidat" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "photoUrl" TEXT,
    "cvUrl" TEXT,
    "posteRecherche" TEXT NOT NULL,
    "domaine" TEXT NOT NULL,
    "niveauEtude" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "localisation" TEXT NOT NULL,
    "disponibilite" TEXT NOT NULL,
    "competences" TEXT NOT NULL,
    "typeProfil" TEXT,
    "confidentiel" BOOLEAN NOT NULL DEFAULT true,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultationCandidat" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "candidatId" TEXT NOT NULL,
    "dateConsultation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultationCandidat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Abonnement" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "type" "TypeAbonnement" NOT NULL,
    "duree" "DureeAbonnement" NOT NULL,
    "statut" "StatutAbonnement" NOT NULL DEFAULT 'ACTIF',
    "dateDebut" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateExpiration" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Abonnement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TarifAbonnement" (
    "id" TEXT NOT NULL,
    "type" "TypeAbonnement" NOT NULL,
    "duree" "DureeAbonnement" NOT NULL,
    "prix" INTEGER NOT NULL,

    CONSTRAINT "TarifAbonnement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Paiement" (
    "id" TEXT NOT NULL,
    "entrepriseId" TEXT NOT NULL,
    "abonnementId" TEXT,
    "montant" INTEGER NOT NULL,
    "modePaiement" TEXT,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "reference" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paiement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OffreEmploi" (
    "id" TEXT NOT NULL,
    "intitulePoste" TEXT NOT NULL,
    "entrepriseNom" TEXT,
    "afficherNom" BOOLEAN NOT NULL DEFAULT true,
    "localisation" TEXT NOT NULL,
    "typeContrat" TEXT NOT NULL,
    "niveauEtude" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "salaire" TEXT,
    "description" TEXT NOT NULL,
    "missions" TEXT NOT NULL,
    "profilRecherche" TEXT NOT NULL,
    "competences" TEXT NOT NULL,
    "statut" "StatutOffre" NOT NULL DEFAULT 'BROUILLON',
    "datePublication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OffreEmploi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DemandeRecrutement" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "entrepriseId" TEXT,
    "nomEntreprise" TEXT NOT NULL,
    "activites" TEXT NOT NULL,
    "situationGeo" TEXT NOT NULL,
    "rccm" TEXT NOT NULL,
    "ifu" TEXT NOT NULL,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "posteRecherche" TEXT NOT NULL,
    "nombrePersonnes" INTEGER NOT NULL,
    "profilCandidat" TEXT NOT NULL,
    "niveauEtude" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "competences" TEXT NOT NULL,
    "grilleSalariale" TEXT NOT NULL,
    "horaireService" TEXT NOT NULL,
    "typeContrat" TEXT NOT NULL,
    "dureeContrat" TEXT NOT NULL,
    "datePriseFonction" TIMESTAMP(3) NOT NULL,
    "observations" TEXT,
    "statut" "StatutDemande" NOT NULL DEFAULT 'NOUVELLE',
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DemandeRecrutement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConditionsRecrutement" (
    "id" TEXT NOT NULL,
    "fraisOuvertureDossier" TEXT,
    "fraisRecrutement" TEXT,
    "modalitesPaiement" TEXT,
    "conditionsRemplacement" TEXT,
    "conditionsParticulieres" TEXT,
    "autresInfos" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConditionsRecrutement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageContact" (
    "id" TEXT NOT NULL,
    "nomPrenom" TEXT NOT NULL,
    "nomEntreprise" TEXT,
    "telephone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "objet" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "statut" "StatutMessage" NOT NULL DEFAULT 'NON_LU',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Entreprise_utilisateurId_key" ON "Entreprise"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidat_reference_key" ON "Candidat"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "ConsultationCandidat_entrepriseId_candidatId_dateConsultati_key" ON "ConsultationCandidat"("entrepriseId", "candidatId", "dateConsultation");

-- CreateIndex
CREATE UNIQUE INDEX "TarifAbonnement_type_duree_key" ON "TarifAbonnement"("type", "duree");

-- CreateIndex
CREATE UNIQUE INDEX "Paiement_reference_key" ON "Paiement"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "DemandeRecrutement_reference_key" ON "DemandeRecrutement"("reference");

-- AddForeignKey
ALTER TABLE "Entreprise" ADD CONSTRAINT "Entreprise_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationCandidat" ADD CONSTRAINT "ConsultationCandidat_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultationCandidat" ADD CONSTRAINT "ConsultationCandidat_candidatId_fkey" FOREIGN KEY ("candidatId") REFERENCES "Candidat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abonnement" ADD CONSTRAINT "Abonnement_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Paiement" ADD CONSTRAINT "Paiement_abonnementId_fkey" FOREIGN KEY ("abonnementId") REFERENCES "Abonnement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DemandeRecrutement" ADD CONSTRAINT "DemandeRecrutement_entrepriseId_fkey" FOREIGN KEY ("entrepriseId") REFERENCES "Entreprise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
