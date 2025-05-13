// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

declare module "next-auth" {
  interface User {
    username?: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }
}

const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Mock API call - replace with your actual authentication logic
          const res = await fetch("https://jsonplaceholder.typicode.com/users");
          const users = await res.json();

          // Admin user check
          if (
            credentials?.email === "admin@admin.com" &&
            credentials.password === "admin123"
          ) {
            return {
              id: "0",
              name: "Admin",
              email: "admin@admin.com",
              username: "admin",
              isAdmin: true,
            };
          }

          // Regular user check
          const user = users.find(
            (user: any) =>
              user.email === credentials?.email &&
              user.username === credentials?.password
          );

          if (user) {
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              username: user.username,
              isAdmin: false,
            };
          }

          return null;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
