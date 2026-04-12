import type { NextAuthConfig } from "next-auth";

// Lightweight auth config for middleware — no Prisma, no bcrypt
// Only JWT session reading (no database calls)
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = (user as any).role;
        token.familyId = (user as any).familyId ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).familyId = token.familyId ?? null;
      }
      return session;
    },
  },
  providers: [], // providers only needed for sign-in, not for JWT reading
};
