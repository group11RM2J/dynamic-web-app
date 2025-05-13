import NextAuth, { type AuthOptions, type SessionStrategy } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import { Session, JWT } from "next-auth";
import { AdapterUser } from "next-auth/adapters";

async function session({
  session,
  token,
  user,
}: {
  session: Session;
  token: JWT;
  user: AdapterUser;
} & { newSession: any; trigger: "update" }): Promise<Session> {
  session.user = token.user as AppUser; // Ensure token.user is properly typed
  return session;
}

// Define user type
type AppUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  isAdmin: boolean;
};

// Extend the default JWT type to include our custom user type
interface AppJWT extends JWT {
  user?: AppUser;
}

// Extend the default Session type
interface AppSession extends Session {
  user: AppUser;
}

// Do NOT export this - just use it inside the handler
const authOptions: AuthOptions = {
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
    strategy: "jwt" as SessionStrategy, // Explicitly type this as SessionStrategy
  },
  callbacks: {
    async jwt({ token, user }: { token: AppJWT; user?: User }) {
      if (user) {
        token.user = user as AppUser;
      }
      return token;
    },
    async session({ session, token }: { session: AppSession; token: AppJWT }) {
      session.user = token.user as AppUser;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

// ✅ Only export GET and POST — not authOptions
export { handler as GET, handler as POST };
