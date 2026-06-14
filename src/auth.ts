import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { authService } from "@/services/auth";

import { InActiveAccountError, InvalidEmailPasswordError } from "@/types/errors";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github,
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null

        const res = await authService.login(credentials as Record<string, string>);

        const data = res.data;

        if (data && data.user) {
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.access_token,
          }
        }
        if (res.statusCode === 401) {
          throw new InvalidEmailPasswordError()
        }
        if (res.statusCode === 403) {
          throw new InActiveAccountError()
        }
        throw new Error("Internal server error")
      },
    }),

  ],
  pages: {
    signIn: "/auth/login",
    error: "/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.access_token = (user as any).access_token;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        (session as any).access_token = token.access_token;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})