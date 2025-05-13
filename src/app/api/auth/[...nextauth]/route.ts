import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

// Extend the default User type to include custom fields
declare module "next-auth" {
  interface User {
    username?: string;
    isAdmin?: boolean;
  }
}

// Define our complete user type
type AppUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

// Extend the default JWT type
interface AppJWT extends JWT {
  user?: AppUser;
}

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users: AppUser[] = await res.json();

        // Hardcoded admin user
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

        // Authenticate based on mock users
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
          name: user.name || '',
          email: user.email || '',
          username: user.username || '',
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
