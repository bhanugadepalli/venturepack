import NextAuth from "next-auth";

export const {
  auth,
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
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role === "admin" ? "admin" : "founder";
      }

      return session;
    },
  },
});
