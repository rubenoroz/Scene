import NextAuth, { getServerSession, AuthOptions } from "next-auth"; // Import getServerSession
import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma"; // Import the singleton Prisma client

// This is your auth configuration
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (isValid) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      if (user) {
        token.id = user.id;
        token.role = user.role; // Assign role from the user object
      }

      // If the user's role is SUPERADMIN, set isSuperAdmin to true
      token.isSuperAdmin = token.role === "SUPERADMIN";

      return token;
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role; // Assign role from the token
        session.user.isSuperAdmin = token.isSuperAdmin; // Assign isSuperAdmin from the token
      }
      return session;
    },
  },
  pages: {
    signIn: '/', // Specify your sign-in page
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// This is the handler for the [...nextauth] route
// It's used by app/api/auth/[...nextauth]/route.ts
export const { handlers } = NextAuth(authOptions);

// This is the server-side auth helper for NextAuth.js v4 in App Router
export async function auth() {
  return getServerSession(authOptions);
}
