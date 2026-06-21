import bcrypt from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";

const isDevLog = process.env.NODE_ENV !== "production";

export const {
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 4 * 60 * 60,
  },
  jwt: {
    maxAge: 4 * 60 * 60,
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember me", type: "checkbox" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";

        if (!email || !password) {
          if (isDevLog) console.log("Credentials login missing email or password");
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

        const storedHash = user?.passwordHash ?? "";

        if (isDevLog) {
          console.log("LOGIN_USER_FOUND", Boolean(user));
          console.log("LOGIN_HAS_PASSWORD_HASH", Boolean(storedHash));
        }

        if (!user || !storedHash || user.accountStatus !== "active" || user.authStatus !== "active") {
          return null;
        }

        const passwordValid = await bcrypt.compare(password, storedHash);

        if (isDevLog) console.log("LOGIN_PASSWORD_VALID", passwordValid);

        if (!passwordValid) {
          return null;
        }

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
