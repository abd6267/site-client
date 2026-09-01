import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/connexion",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.motDePasse) return null;

        const utilisateur = await prisma.utilisateur.findUnique({
          where: { email: credentials.email as string },
          include: { entreprise: true },
        });

        if (!utilisateur) return null;

        const motDePasseValide = await bcrypt.compare(
          credentials.motDePasse as string,
          utilisateur.motDePasse
        );

        if (!motDePasseValide) return null;

        return {
          id: utilisateur.id,
          email: utilisateur.email,
          role: utilisateur.role,
          entrepriseId: utilisateur.entreprise?.id ?? null,
          statutEntreprise: utilisateur.entreprise?.statut ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.entrepriseId = user.entrepriseId;
        token.statutEntreprise = user.statutEntreprise;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.entrepriseId = token.entrepriseId as string | null;
        session.user.statutEntreprise = token.statutEntreprise as string | null;
      }
      return session;
    },
  },
});