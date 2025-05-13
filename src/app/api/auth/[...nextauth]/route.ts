import NextAuth from "next-auth/next"; // ✅ v5+ syntax
import Credentials from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import { User, Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend User type
declare module "next-auth" {
  interface User {
    username?: string;
    isAdmin?: boolean;
  }
}

type AppUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

interface AppJWT extends JWT {
  user?: AppUser;
}

export const authConfig = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users: AppUser[] = await res.json();

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

        const user = users.find(
          (user) =>
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
    async jwt({ token, user }: { token: AppJWT; user?: User }) {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name || "",
          email: user.email || "",
          username: user.username || "",
          isAdmin: user.isAdmin || false,
        };
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: AppJWT }) {
      if (token.user) {
        session.user = {
          ...session.user,
          ...token.user,
        };
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

// ✅ export handlers for API routes
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
