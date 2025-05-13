// src/types/next-auth.d.ts
declare module "next-auth" {
  interface Session {
    user: AppUser;
  }

  interface JWT {
    user?: AppUser;  // Made optional since it might not always be present
  }

  interface User extends AppUser {
    // Extending the default User interface with our AppUser properties
  }
}

interface AppUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  // Add any additional custom fields your app needs
}
