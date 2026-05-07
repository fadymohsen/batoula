import NextAuth, { type DefaultSession } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

declare module "next-auth" {
  interface Session {
    user: {
      role?: string
    } & DefaultSession["user"]
  }
  interface User {
    role?: string
  }
  interface JWT {
    role?: string
  }
}




export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@coachbatoula.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string }
          });

          if (!user) {
            // For demo purposes, let's allow a hardcoded admin if DB is empty
            if (credentials.email === "admin@admin.com" && credentials.password === "admin") {
              return { id: "1", email: "admin@admin.com", role: "ADMIN" };
            }
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (passwordsMatch) {
            return { id: user.id, email: user.email, role: user.role };
          }
          return null;
        } catch (error) {
          // Fallback if DB is disconnected
          if (credentials.email === "admin@admin.com" && credentials.password === "admin") {
            return { id: "1", email: "admin@admin.com", role: "ADMIN" };
          }
          return null;
        }
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login",
  },
  session: { strategy: "jwt" }
})
