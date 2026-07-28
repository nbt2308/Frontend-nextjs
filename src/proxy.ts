import { auth } from "@/auth"
import { getToken } from "next-auth/jwt";

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|verify|$).*)',
    ],
}
export default auth(async (req) => {
    const token = await getToken({
        req: req,
        secret: process.env.AUTH_SECRET
    });
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    const isAuthPage = pathname.startsWith("/auth")
    const isAdminLogin = pathname === '/admin-login';
    const isAdminRoute = pathname.startsWith('/admin') && !isAdminLogin;
    if (isLoggedIn) {
        if (isAuthPage) {
            return Response.redirect(new URL("/", req.nextUrl.origin))
        }
        if (isAdminLogin && token?.role === "ADMIN") {
            return Response.redirect(new URL("/admin/dashboard", req.nextUrl.origin));
        }
    }
    if (isAdminRoute) {
        if (!token || token.role !== "ADMIN") {
            return Response.redirect(new URL("/admin-login", req.nextUrl.origin));
        }
    }
    if (!isLoggedIn && !isAuthPage && !isAdminLogin && !isAdminRoute) {
        return Response.redirect(new URL("/auth/login", req.nextUrl.origin))
    }
})