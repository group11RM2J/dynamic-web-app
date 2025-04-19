// /app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions, User } from "next-auth";

interface JSONPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  // Add other fields if needed
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users: JSONPlaceholderUser[] = await res.json();

        const matchedUser = users.find(
          (user) =>
            user.email === credentials?.email &&
            user.username === credentials?.password // Username is the password
        );

        if (matchedUser) {
          return {
            id: matchedUser.id.toString(),
            name: matchedUser.name,
            email: matchedUser.email,
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
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.user) {
        session.user = token.user as User;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
