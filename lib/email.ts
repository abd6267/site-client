import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function envoyerEmailDemande({
  destinataire,
  nomEntreprise,
  reference,
  pdfBuffer,
}: {
  destinataire: string;
  nomEntreprise: string;
  reference: string;
  pdfBuffer: Buffer;
}) {
  try {
    await resend.emails.send({
      from: "BTEC BENIN <onboarding@resend.dev>",
      to: destinataire,
      subject: `Votre demande de recrutement — Réf. ${reference}`,
      html: `
        <p>Bonjour,</p>
        <p>Nous avons bien reçu votre demande de recrutement pour <strong>${nomEntreprise}</strong>.</p>
        <p>Numéro de référence : <strong>${reference}</strong></p>
        <p>Vous trouverez en pièce jointe le document PDF récapitulatif de votre demande. Merci de :</p>
        <ol>
          <li>Le télécharger et l'imprimer</li>
          <li>Le signer et le cacheter</li>
          <li>Le transmettre au Cabinet BTEC BENIN</li>
        </ol>
        <p>Notre équipe traitera votre demande dans les meilleurs délais.</p>
        <p>Cordialement,<br/>L'équipe BTEC BENIN</p>
      `,
      attachments: [
        {
          filename: `Demande-${reference}.pdf`,
          content: pdfBuffer,
        },
      ],
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email :", error);
    return { success: false, error };
  }
}

export async function envoyerEmailInscription({
  destinataire,
  nomEntreprise,
}: {
  destinataire: string;
  nomEntreprise: string;
}) {
  try {
    await resend.emails.send({
      from: "BTEC BENIN <onboarding@resend.dev>",
      to: destinataire,
      subject: "Bienvenue sur BTEC BENIN — Compte créé",
      html: `
        <p>Bonjour,</p>
        <p>Votre compte entreprise <strong>${nomEntreprise}</strong> a bien été créé sur la plateforme BTEC BENIN.</p>
        <p>Votre compte est actuellement <strong>en attente de validation</strong> par notre équipe. Vous recevrez un e-mail dès que votre compte sera validé et activé.</p>
        <p>Cordialement,<br/>L'équipe BTEC BENIN</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email inscription :", error);
    return { success: false, error };
  }
}

export async function envoyerEmailValidationCompte({
  destinataire,
  nomEntreprise,
}: {
  destinataire: string;
  nomEntreprise: string;
}) {
  try {
    await resend.emails.send({
      from: "BTEC BENIN <onboarding@resend.dev>",
      to: destinataire,
      subject: "Votre compte BTEC BENIN a été validé",
      html: `
        <p>Bonjour,</p>
        <p>Bonne nouvelle ! Le compte de <strong>${nomEntreprise}</strong> a été validé par notre équipe.</p>
        <p>Vous pouvez désormais vous connecter et souscrire à un abonnement pour accéder à la BTEC CVTHÈQUE.</p>
        <p>Cordialement,<br/>L'équipe BTEC BENIN</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email validation :", error);
    return { success: false, error };
  }
}

export async function envoyerEmailRejetCompte({
  destinataire,
  nomEntreprise,
}: {
  destinataire: string;
  nomEntreprise: string;
}) {
  try {
    await resend.emails.send({
      from: "BTEC BENIN <onboarding@resend.dev>",
      to: destinataire,
      subject: "Votre demande de compte BTEC BENIN",
      html: `
        <p>Bonjour,</p>
        <p>Nous vous remercions pour votre inscription au nom de <strong>${nomEntreprise}</strong>.</p>
        <p>Après vérification, nous ne sommes malheureusement pas en mesure de valider votre compte pour le moment. N'hésitez pas à nous contacter pour plus d'informations.</p>
        <p>Cordialement,<br/>L'équipe BTEC BENIN</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email rejet :", error);
    return { success: false, error };
  }
}

export async function envoyerEmailConfirmationAbonnement({
  destinataire,
  nomEntreprise,
  type,
  duree,
  dateExpiration,
}: {
  destinataire: string;
  nomEntreprise: string;
  type: string;
  duree: string;
  dateExpiration: string;
}) {
  try {
    await resend.emails.send({
      from: "BTEC BENIN <onboarding@resend.dev>",
      to: destinataire,
      subject: "Votre abonnement BTEC CVTHÈQUE est actif",
      html: `
        <p>Bonjour,</p>
        <p>Votre abonnement <strong>${type}</strong> (${duree}) pour <strong>${nomEntreprise}</strong> a bien été activé.</p>
        <p>Vous pouvez dès maintenant accéder à la BTEC CVTHÈQUE et consulter des candidats selon votre formule.</p>
        <p>Votre abonnement est valable jusqu'au <strong>${dateExpiration}</strong>.</p>
        <p>Cordialement,<br/>L'équipe BTEC BENIN</p>
      `,
    });
    return { success: true };
  } catch (error) {
    console.error("Erreur envoi email abonnement :", error);
    return { success: false, error };
  }
}