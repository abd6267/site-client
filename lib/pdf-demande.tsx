import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    marginBottom: 20,
    borderBottom: "2 solid #1B3A5C",
    paddingBottom: 12,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B3A5C",
  },
  sousTitre: {
    fontSize: 9,
    color: "#4a4a4a",
    marginTop: 2,
  },
  titreDoc: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 4,
    color: "#1B3A5C",
  },
  reference: {
    fontSize: 9,
    color: "#4a4a4a",
    marginBottom: 16,
  },
  sectionTitre: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1B3A5C",
    marginTop: 16,
    marginBottom: 8,
    borderBottom: "1 solid #e5e2d9",
    paddingBottom: 4,
  },
  ligne: {
    flexDirection: "row",
    marginBottom: 6,
  },
  label: {
    width: 180,
    color: "#4a4a4a",
  },
  valeur: {
    flex: 1,
    fontWeight: "bold",
  },
  conditions: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#faf9f6",
    border: "1 solid #e5e2d9",
    fontSize: 9,
    lineHeight: 1.5,
  },
  signature: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boiteSignature: {
    width: 200,
    height: 80,
    border: "1 solid #4a4a4a",
    padding: 8,
    fontSize: 8,
    color: "#4a4a4a",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: "#4a4a4a",
    textAlign: "center",
    borderTop: "1 solid #e5e2d9",
    paddingTop: 8,
  },
});

type Props = {
  reference: string;
  dateCreation: string;
  nomEntreprise: string;
  activites: string;
  situationGeo: string;
  rccm: string;
  ifu: string;
  telephone: string;
  email: string;
  posteRecherche: string;
  nombrePersonnes: number;
  profilCandidat: string;
  niveauEtude: string;
  experience: string;
  competences: string;
  grilleSalariale: string;
  horaireService: string;
  typeContrat: string;
  dureeContrat: string;
  datePriseFonction: string;
  observations?: string;
};

function Ligne({ label, valeur }: { label: string; valeur: string }) {
  return (
    <View style={styles.ligne}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valeur}>{valeur}</Text>
    </View>
  );
}

export default function DocumentDemande(props: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>BTEC BENIN</Text>
          <Text style={styles.sousTitre}>
            Best Technology Corporation — Cabinet de recrutement et de gestion des ressources humaines
          </Text>
          <Text style={styles.sousTitre}>Cotonou, Bénin · +229 00 00 00 00 · contact@btecbenin.com</Text>
        </View>

        <Text style={styles.titreDoc}>Fiche de demande de recrutement</Text>
        <Text style={styles.reference}>
          Référence : {props.reference} — Date de la demande : {props.dateCreation}
        </Text>

        <Text style={styles.sectionTitre}>A. Informations sur l&apos;entreprise</Text>
        <Ligne label="Nom de l'entreprise" valeur={props.nomEntreprise} />
        <Ligne label="Activités / services" valeur={props.activites} />
        <Ligne label="Situation géographique" valeur={props.situationGeo} />
        <Ligne label="Numéro RCCM" valeur={props.rccm} />
        <Ligne label="Numéro IFU" valeur={props.ifu} />
        <Ligne label="Téléphone" valeur={props.telephone} />
        <Ligne label="E-mail" valeur={props.email} />

        <Text style={styles.sectionTitre}>B. Informations sur le recrutement</Text>
        <Ligne label="Poste recherché" valeur={props.posteRecherche} />
        <Ligne label="Nombre de personnes" valeur={String(props.nombrePersonnes)} />
        <Ligne label="Profil du candidat" valeur={props.profilCandidat} />
        <Ligne label="Niveau d'étude" valeur={props.niveauEtude} />
        <Ligne label="Expérience souhaitée" valeur={props.experience} />
        <Ligne label="Compétences recherchées" valeur={props.competences} />
        <Ligne label="Grille salariale" valeur={props.grilleSalariale} />
        <Ligne label="Horaire de service" valeur={props.horaireService} />
        <Ligne label="Type de contrat" valeur={props.typeContrat} />
        <Ligne label="Durée du contrat" valeur={props.dureeContrat} />
        <Ligne label="Date souhaitée de prise de fonction" valeur={props.datePriseFonction} />
        {props.observations && <Ligne label="Observations" valeur={props.observations} />}

        <View style={styles.conditions}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
            Conditions de recrutement BTEC BENIN
          </Text>
          <Text>
            Frais d&apos;ouverture de dossier, frais de recrutement et modalités de paiement
            applicables selon la grille tarifaire en vigueur de BTEC BENIN. Toute demande de
            remplacement est soumise aux conditions générales du Cabinet. Le présent document
            doit être signé et cacheté par l&apos;entreprise, puis transmis à BTEC BENIN pour
            traitement de la demande.
          </Text>
        </View>

        <View style={styles.signature}>
          <View style={styles.boiteSignature}>
            <Text>Cachet et signature de l&apos;entreprise</Text>
          </View>
          <View style={styles.boiteSignature}>
            <Text>Pour BTEC BENIN</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          BTEC BENIN — Best Technology Corporation · Ce document est généré automatiquement et doit être signé pour validation.
        </Text>
      </Page>
    </Document>
  );
}