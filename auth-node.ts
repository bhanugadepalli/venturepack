import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";

export const {
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        console.log("Auth authorize called:", { email, passwordLength: password.length });

        if (!email || !password) {
          console.log("Missing email or password");
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            passwordHash: true,
            accountStatus: true,
            authStatus: true,
          },
        });

        console.log("User found:", {
          found: !!user,
          email: user?.email,
          hasPasswordHash: !!user?.passwordHash,
          accountStatus: user?.accountStatus,
          authStatus: user?.authStatus,
        });

        if (!user?.passwordHash || user.accountStatus !== "active" || user.authStatus !== "active") {
          console.log("User validation failed");
          return null;
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);
        console.log("Password comparison result:", passwordMatches);

        if (!passwordMatches) {
          console.log("Password does not match");
          return null;
        }

        console.log("Auth successful for user:", user.email);
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role === "admin" ? "admin" : "founder",
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user?.role) {
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role === "admin" ? "admin" : "founder";
      }

      return session;
    },
  },
});
