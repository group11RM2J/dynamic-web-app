import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch("https://jsonplaceholder.typicode.com/users");
        const users = await res.json();
      
        // Admin check
        if (credentials?.email === "admin@admin.com" && credentials.password === "admin123") {
          return {
            id: "0",
            name: "Admin",
            email: "admin@admin.com",
            username: "admin",
            isAdmin: true,
          };
        }
      
        // Normal user check
        const user = users.find((user: any) =>
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
    async jwt({ token, user }) {
      if (user) {
        token.user = user as any;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user as any;
      return session;
    },
  },
};

// Now use authOptions inside NextAuth()
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
