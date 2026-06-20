import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "founder" | "admin";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "founder" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "founder" | "admin";
  }
}
