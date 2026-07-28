import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { authService } from "@/services/auth";

import { ISignIn } from "./schemas/auth.schema";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Github,
    Google,
    Credentials({
      id: "credentials",
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
        return null;
      },
    }),
    Credentials({
      id: "admin-login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null
        const dataSignIn = {
          email: credentials.email,
          password: credentials.password
        }
        const res = await authService.adminLogin(dataSignIn as ISignIn);

        const data = res.data ?? res; // Depending on how adminLogin response is wrapped

        if (data && data.user) {
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            accessToken: data.access_token,
            role: data.user.role,
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account, profile }) {

      if (account?.provider === "github" || account?.provider === "google") {
        try {
          const res = await authService.handleOAuthLogin(user, account);
          if (res.data) {
            (user as any).access_token = res.data.access_token;
            (user as any).user = res.data.user;
            return true;
          }
          return false;
        }
        catch (error: any) {
          console.log(error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
      }
      if (account) {
        if (account.provider === "credentials" || account.provider === "admin-login") {
          token.access_token = (user as any).accessToken;
          token.role = (user as any).role; // Add role support for credentials as well
        } else {
          token.access_token = (user as any).access_token;
          token.id = (user as any).user?.id;
          token.role = (user as any).user?.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session as any).access_token = token.access_token;
        (session as any).role = token.role;
      }
      return session;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
  },
})