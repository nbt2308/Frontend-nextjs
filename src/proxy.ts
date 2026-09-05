
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { RoleSchema } from "./types/generated-zod/schemas";
import { SYSTEM_ROLES } from "./constants/roles.constant";

export const config = {
    matcher: [
        "/((?!api/auth|_next/static|_next/image|favicon.ico|verify|$).*)",
    ],
};

// Public routes không yêu cầu đăng nhập
const PUBLIC_ROUTES = ["/course"];

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;
    // req.auth được tạo từ session callback của Auth.js
    // auth.ts hiện tại đang đưa role vào session.role
    const role = req.auth?.user?.role;

    const isAuthPage = pathname.startsWith("/auth");
    const isAdminLogin = pathname === "/admin-login";
    const isAdminRoute =
        pathname.startsWith("/admin") && !isAdminLogin;

    const isPublicRoute = PUBLIC_ROUTES.some((route) =>
        pathname.startsWith(route)
    );



    // auth.ts set token.error = "RefreshTokenError"
    // và session callback đưa nó ra session.error
    const authError = (req.auth as any)?.error;

    /*
     * =====================================================
     * 1. REFRESH TOKEN THẤT BẠI
     * =====================================================
     *
     * Phải xử lý admin và user riêng.
     *
     * Admin:
     *     /admin/* → /admin-login
     *
     * User:
     *     các protected route → /auth/login
     */
    if (authError === "RefreshTokenError") {
        if (isAdminRoute) {
            return NextResponse.redirect(
                new URL("/admin-login", req.nextUrl.origin)
            );
        }
        if (isAdminLogin) {
            return NextResponse.next();
        }

        if (!isPublicRoute && !isAuthPage) {
            return NextResponse.redirect(
                new URL("/auth/login", req.nextUrl.origin)
            );
        }

        return NextResponse.next();
    }

    /*
     * =====================================================
     * 2. CHƯA ĐĂNG NHẬP
     * =====================================================
     */
    if (!isLoggedIn) {
        // Admin route → admin login
        if (isAdminRoute) {
            return NextResponse.redirect(
                new URL("/admin-login", req.nextUrl.origin)
            );
        }

        // Các route public/auth → cho phép truy cập
        if (isAuthPage || isAdminLogin || isPublicRoute) {
            return NextResponse.next();
        }

        // Protected user route → user login
        return NextResponse.redirect(
            new URL("/auth/login", req.nextUrl.origin)
        );
    }

    /*
     * =====================================================
     * 3. ĐÃ ĐĂNG NHẬP NHƯNG KHÔNG PHẢI ADMIN
     * =====================================================
     */
    if (isAdminRoute && !role?.includes(SYSTEM_ROLES.ADMIN)) {
        return NextResponse.redirect(
            new URL("/", req.nextUrl.origin)
        );
    }

    /*
     * =====================================================
     * 4. ADMIN ĐÃ LOGIN MÀ TRUY CẬP /admin-login
     * =====================================================
     */
    if (isAdminLogin) {
        if (role?.includes(SYSTEM_ROLES.ADMIN)) {
            return NextResponse.redirect(
                new URL("/admin/dashboard", req.nextUrl.origin)
            );
        }

        return NextResponse.redirect(
            new URL("/", req.nextUrl.origin)
        );
    }

    /*
     * =====================================================
     * 5. USER ĐÃ LOGIN MÀ TRUY CẬP /auth/*
     * =====================================================
     */
    if (isAuthPage) {
        return NextResponse.redirect(
            new URL("/", req.nextUrl.origin)
        );
    }

    return NextResponse.next();
});
