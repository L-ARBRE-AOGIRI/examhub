import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { verifierBlocageConnexion, enregistrerEchecConnexion, reinitialiserTentativesConnexion } from "./rateLimiter";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        motDePasse: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = (credentials.email || "").toString().trim().toLowerCase();

        const blocage = verifierBlocageConnexion(email);
        if (blocage.bloque) {
          throw new Error("Trop de tentatives. Réessayez dans " + blocage.minutesRestantes + " minute(s)");
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          enregistrerEchecConnexion(email);
          throw new Error("Identifiants incorrects");
        }

        const valide = await bcrypt.compare(credentials.motDePasse, user.motDePasse);
        if (!valide) {
          enregistrerEchecConnexion(email);
          throw new Error("Identifiants incorrects");
        }

        if (user.statutCompte === "BLOQUE") {
          throw new Error("Votre compte a été bloqué");
        }

        reinitialiserTentativesConnexion(email);

        return {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role,
          statutCompte: user.statutCompte,
        };
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.statutCompte = user.statutCompte;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.id = token.id;
      session.user.statutCompte = token.statutCompte;
      return session;
    },
  },
  pages: {
    signIn: "/connexion",
  },
};
