import { auth } from "@/auth"


export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|verify|$).*)',
    ],
}
export default auth((req) => {
    const isLoggedIn = !!req.auth
    const { pathname } = req.nextUrl

    const isAuthPage = pathname === "/auth/login" || pathname === "/auth/register"

    if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL("/", req.nextUrl.origin))
    }
    if (!isLoggedIn && !isAuthPage) {
        return Response.redirect(new URL("/auth/login", req.nextUrl.origin))
    }
})