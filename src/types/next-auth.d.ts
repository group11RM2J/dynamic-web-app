import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: AppUser;
  }

  interface JWT {
    user: AppUser;
  }
}

interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}
