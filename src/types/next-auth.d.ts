import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt" // Import JWT type

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role?: "USER" | "ADMIN" | "SUPERADMIN"; // Add role to session user
            isSuperAdmin?: boolean; // Add isSuperAdmin to session user
        } & DefaultSession["user"]
    }

    interface User {
        role?: "USER" | "ADMIN" | "SUPERADMIN"; // Add role to User type
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role?: "USER" | "ADMIN" | "SUPERADMIN"; // Add role to JWT
        isSuperAdmin?: boolean; // Add isSuperAdmin to JWT
    }
}