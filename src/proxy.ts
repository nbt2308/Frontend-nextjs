import { auth } from "@/auth"
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon.ico|verify|$).*)',
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
    if (!isLoggedIn) {
        if (isAdminRoute) {
            return NextResponse.redirect(new URL("/admin-login", req.nextUrl.origin))
        }
        if (isAuthPage || isAdminLogin) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    if (isAdminRoute && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (isAdminLogin) {
        if (token?.role === "ADMIN") {
            return NextResponse.redirect(new URL("/admin/dashboard", req.nextUrl));
        }
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (isAuthPage && token) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    return NextResponse.next();
})