import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    signIn({ user }) {
      const allowed = process.env.AUTH_ALLOWED_EMAIL;
      if (!allowed) return false;
      return user.email === allowed;
    },
    authorized({ auth: session }) {
      return !!session?.user;
    },
  },
});
