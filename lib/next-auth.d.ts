import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      entrepriseId: string | null;
      statutEntreprise: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    entrepriseId: string | null;
    statutEntreprise: string | null;
  }
}