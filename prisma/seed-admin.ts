import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "btec@gmail.com";
  const motDePasse = "Nabil6267";

  const motDePasseHash = await bcrypt.hash(motDePasse, 10);

  const existant = await prisma.utilisateur.findUnique({ where: { email } });
  if (existant) {
    console.log("Un compte avec cet email existe déjà.");
    return;
  }

  await prisma.utilisateur.create({
    data: {
      email,
      motDePasse: motDePasseHash,
      role: "ADMIN",
    },
  });

  console.log("Compte admin créé avec succès !");
  console.log("Email :", email);
  console.log("Mot de passe :", motDePasse);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());