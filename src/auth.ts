import NextAuth, { CredentialsSignin } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import Github from "next-auth/providers/github"
import { authService } from "@/services/auth";

import { ISignIn } from "./schemas/auth.schema";
import { getTokenExpire } from "./lib/utils";
import { IUser } from "./types/next-auth";
import { withRefreshLock } from "./lib/auth/refresh-lock";



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
                    const me = await authService.getMe(data.access_token);
                    return {
                        user: {
                            id: me.data.id,
                            name: me.data.name,
                            email: me.data.email,
                            role: me.data.roles,
                            avatar: me.data.avatar,
                        },
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
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
                    const me = await authService.getMe(data.access_token);

                    return {
                        user: {
                            id: me.data.id,
                            name: me.data.name,
                            email: me.data.email,
                            role: me.data.roles,
                            avatar: me.data.avatar,
                        },
                        access_token: data.access_token,
                        refresh_token: data.refresh_token,
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
    events: {
        async signOut(message) {
            if ("token" in message && message.token?.refresh_token) {
                try {
                    await authService.logout(message.token.refresh_token as string);
                } catch (error) {
                    console.error("Lỗi khi revoke refresh token trên backend:", error);
                }
            }
        },
    },
    callbacks: {
        async signIn({ user, account, profile }) {

            if (account?.provider === "github" || account?.provider === "google") {
                try {
                    const res = await authService.handleOAuthLogin(user, account);
                    if (res.data) {
                        const me = await authService.getMe(res.data.access_token);
                        user.user = {
                            id: me.id,
                            name: me.name,
                            email: me.email,
                            role: me.roles,
                            avatar: me.avatar,
                        } as IUser;
                        user.access_token = res.data.access_token;
                        user.refresh_token = res.data.refresh_token;
                        return true;
                    }
                    return false;
                }
                catch (error: any) {
                    return `/auth/login?error=${encodeURIComponent(error?.message)}`;
                }
            }
            return true;
        },
        async jwt({ token, user, account, trigger, session }) {
            // Lần đầu đăng nhập → lưu access_token, refresh_token, access_expire
            if (account) {
                if (account.provider === "credentials" || account.provider === "admin-login") {
                    token.access_token = user.access_token;
                    token.refresh_token = user.refresh_token;
                    token.user = user.user;
                } else {
                    // OAuth providers (Google, GitHub)
                    token.access_token = user.access_token;
                    token.refresh_token = user.refresh_token;
                    token.user = user.user;
                }
                // Set thời gian hết hạn access token
                token.access_expire = getTokenExpire(
                    token.access_token as string
                );
                token.error = "";
                return token;
            }
            if (!token.access_token) {
                return token;
            }
            // Thêm 60 giây khoảng đệm (leeway) để chủ động refresh trước khi thực sự hết hạn
            const now = Date.now();
            const bufferTime = 60 * 1000;
            // Nếu access token chưa hết hạn → trả về token hiện tại
            if (now + bufferTime < (token.access_expire as number)) {
                return token;
            }
            if (!token.refresh_token) {
                token.error = "RefreshTokenError";
                token.access_token = "";
                token.access_expire = 0;
                return token;
            }

            // Token hết hạn → gọi refresh
            try {
                const userId = (token.user as IUser)?.id;

                const data = await withRefreshLock(
                    String(userId),
                    async () => {
                        const res = await authService.refreshToken(
                            token.refresh_token as string,
                        );

                        return res.data ?? res;
                    },
                );

                token.access_token = data.access_token;
                token.refresh_token = data.refresh_token;
                token.access_expire = getTokenExpire(token.access_token as string);
                token.error = "";
            } catch (error) {
                console.error("Refresh token thất bại:", error);
                token.error = "RefreshTokenError";
                token.access_token = "";
                token.refresh_token = "";
                token.access_expire = 0;
            }

            return token;
        },
        async session({ session, token }) {
            if (token.error === "RefreshTokenError") {
                session.access_token = "";
                session.access_expire = 0;
                session.error = token.error;
                return session;
            }
            if (token && session.user) {
                session.user = token.user as any;
            }
            session.access_token = token.access_token;
            session.access_expire = token.access_expire;
            session.error = token.error;
            return session;
        },
        authorized: async ({ auth }) => {
            // Logged in users are authenticated, otherwise redirect to login page
            return !!auth
        },
    },
})