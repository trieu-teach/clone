import { withAuth, NextRequestWithAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(request: NextRequestWithAuth) {

        if (request.nextUrl.pathname.startsWith("/doc")) {
            console.log(request.nextauth.token?.role)
            if (request.nextauth.token?.role !== "admin") {
                return NextResponse.rewrite(new URL('/forbidden', request.url))
            }
        }

        if (request.nextUrl.pathname.startsWith("/client")
            && request.nextauth.token?.role !== "admin"
            && request.nextauth.token?.role !== "manager") {
            return NextResponse.rewrite(
                new URL('/forbidden', request.url)
            )
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

export const config = { matcher: ["/extra", "/client", "/doc"] }
